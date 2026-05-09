package com.apphub.backend.Services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import com.apphub.backend.models.Upgrade_resume;
import com.apphub.backend.models.User;
import com.apphub.backend.repositories.Upgrade_resume_repository;
import com.apphub.backend.repositories.User_repository;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class Upgrade_resume_service {

    private final Upgrade_resume_repository upgrade_resume_repository;
    private final User_repository user_repository;
    private final Ai_service ai_service;
    private final S3Client s3Client;
    private final String resume_bucket="uploaded-resume-s3";
    private final S3Presigner s3Presigner;
    private String allowedContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    public Upgrade_resume_service(Upgrade_resume_repository upgrade_resume_repository, S3Client s3Client, User_repository user_repository, WebClient client, S3Presigner s3Presigner, Ai_service ai_service) {
        this.upgrade_resume_repository = upgrade_resume_repository;
        this.s3Client = s3Client;
        this.user_repository = user_repository;
        this.s3Presigner = s3Presigner;
        this.ai_service = ai_service;

    }
    
    public void upload_to_s3(String fileName, byte[] file_bytes)
    {
        try {
         PutObjectRequest request = PutObjectRequest.builder()
            .bucket(resume_bucket)
            .key(fileName)
            .contentType(allowedContentType)
            .build();

        s3Client.putObject(request,
            RequestBody.fromInputStream(
                    new ByteArrayInputStream(file_bytes),
                    file_bytes.length
            ));

        } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("S3 upload failed "+e.getMessage(), e);
       }

    }

    public long upload_resume(MultipartFile file, String email, String jobPosition) throws IOException{
        try {
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        validate_file(file);

        //save resume to s3
        Long userId = user.getID();
        String originalFileName = file.getOriginalFilename();
        String fileName = "resumes/" +userId+ "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        LocalDateTime uploadedAt = LocalDateTime.now();
        Upgrade_resume resume = save_resume(file, fileName, email, jobPosition, uploadedAt);
        Long fileId = resume.getId();

        //ai process resume and upload new one to s3 when its done
        CompletableFuture<byte[]> upgraded_resume_future = ai_service.improve_resume_with_ai(file, jobPosition, userId, originalFileName, fileId);
        upgraded_resume_future.thenAccept(upgraded_resume -> upload_upgraded_resume(userId, originalFileName, upgraded_resume, fileId));
       
        //upload original resume to s3
        byte[] file_bytes = file.getBytes();
        upload_to_s3(fileName, file_bytes);
       
        return resume.getId();

        } catch (IOException e) {
          throw new IOException("Failed to process file upload", e);
        }
        
    }
    
    public void validate_file(MultipartFile file){
        String contentType = file.getContentType();
        if (!contentType.equals(allowedContentType)) {
            throw new RuntimeException("Invalid file type. Only .docx and .pdf files are allowed.");
        }
        if(file.isEmpty()){
            throw new RuntimeException("File is empty");
        }
        String fileName = file.getOriginalFilename();
        if(fileName==null || !fileName.toLowerCase().endsWith(".docx")){
           throw new RuntimeException("Invalid file extension. Must be .docx");
        }
    }

//upload new resume to s3 after its done
    public void upload_upgraded_resume(Long userId, String original_file_name, byte[] upgraded_resume, Long fileId){
      
        String file_name = "upgraded-resumes/" +userId+ "/" + System.currentTimeMillis() + "_" +original_file_name;
        Upgrade_resume resume = upgrade_resume_repository.findById(fileId)
            .orElseThrow(()->new RuntimeException("file not found"));
            
        resume.setUpgradedResumeFileName(file_name);
        upgrade_resume_repository.save(resume);
        //getfileid and set file name for new resume
        upload_to_s3(file_name, upgraded_resume);

    }

    



    public Upgrade_resume save_resume(MultipartFile file, String fileName, String email, String jobPosition, LocalDateTime uploadedAt){
        try {
            
            User user = user_repository.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            String fileUrl = "https://" + resume_bucket + ".s3.amazonaws.com/" + fileName;
            String fileType = file.getContentType();
            double fileSize = Math.round((file.getSize() / 1024.0) * 100.0) / 100.0;
            Upgrade_resume resume = new Upgrade_resume(user, jobPosition, fileUrl, uploadedAt, fileName, fileType, fileSize);
         
            return upgrade_resume_repository.save(resume);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Saving resume data to table failed: "+e.getMessage());
        }
    }

    


    public String get_presigned_url(String email, long fileId){
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Upgrade_resume resume = upgrade_resume_repository.findById(fileId)
            .orElseThrow(()-> new RuntimeException("could not find resume in database"));

        if (!user.getID().equals(resume.getUser().getID())) {
            throw new RuntimeException("Unauthorized access");
        }

        String fileName = resume.getUpgradedResumeFileName();
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(resume_bucket)
            .key(fileName)
            .build();

        GetObjectPresignRequest presignRequest =
                GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofDays(1))
                        .getObjectRequest(getObjectRequest)
                        .build();
        PresignedGetObjectRequest presignedRequest =
                s3Presigner.presignGetObject(presignRequest);

        return presignedRequest.url().toString();
    }


}

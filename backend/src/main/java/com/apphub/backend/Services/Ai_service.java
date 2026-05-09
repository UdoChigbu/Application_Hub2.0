package com.apphub.backend.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;



@Service
public class Ai_service {
    private final WebClient client;
   

    public Ai_service(WebClient client) {
        this.client = client;
    }


    @Async
     public CompletableFuture<byte[]> improve_resume_with_ai(MultipartFile file, String jobPosition, Long userId, String originalFileName, Long fileId){
        String resume_text = extract_text(file);
        String prompt = build_resume_improvement_prompt(resume_text, jobPosition);

        return client.post()
        .uri("/api/chat") 
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(Map.of(
                "model", "phi3",
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content", "You are an expert resume writer. Follow the requested section structure exactly."
                        ),
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "options", Map.of(
                    "temperature", 0.3,
                    "num_predict", 800
                ),
                "stream", false
        ))
        .retrieve()
        .bodyToMono(Map.class)
        .map(res -> {
          
            Map message = (Map) res.get("message");
            return message.get("content").toString();
        })
        .map(this::save_as_docx)
        .toFuture();
    }

    private String build_resume_improvement_prompt(String resumeText, String jobPosition) {
        return "Improve this resume for the job: " + jobPosition + ".\n" +
            "Keep contact info exactly the same at the top.\n" +
            "Do not invent any information.\n" +
            "Use only these sections in this order: SUMMARY, SKILLS, EXPERIENCE, EDUCATION.\n" +
            "Use short bullet points only. No paragraphs. No fluff. No repeated ideas.\n" +
            "Keep it around 500 words.\n" +
            "KEEP IT ONE PAGE.\n"+
            "SUMMARY: 2-3 bullets tailored to the job.\n" +
            "SKILLS: most relevant skills first.\n" +
            "EXPERIENCE: highlight relevant impact and responsibilities for each role.\n" +
            "EDUCATION: include only school details already in the resume.\n" +
            "Return only the final resume text.\n\n" +
            "RESUME:\n" + resumeText;
    }

    public String extract_text(MultipartFile file){
        try (InputStream inputStream = file.getInputStream();
            XWPFDocument document = new XWPFDocument(inputStream);
            XWPFWordExtractor extractor = new XWPFWordExtractor(document)){
            return extractor.getText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text :",e);
        }
    }

      //turns resume from text to file format
    public byte[] save_as_docx(String response){
        try (XWPFDocument document = new XWPFDocument();
            ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            String[] lines = response.split("\n");
            for(String line: lines){
                XWPFParagraph paragraph = document.createParagraph();
                XWPFRun run = paragraph.createRun();
                run.setText(line);
            }
            document.write(out);
            return out.toByteArray();


        }
        catch (Exception e) {
            throw new RuntimeException("Failed to extract text :",e);
        }
        
    }
}

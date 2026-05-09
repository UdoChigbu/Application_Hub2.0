package com.apphub.backend.controllers;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.apphub.backend.Services.Upgrade_resume_service;




@RestController
@RequestMapping("/api/upgrade_resume")
public class Upgrade_resume_controller {
    private final Upgrade_resume_service upgrade_resume_service;
    

    public Upgrade_resume_controller(Upgrade_resume_service upgrade_resume_service) {
        this.upgrade_resume_service = upgrade_resume_service;
       
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }


    @PostMapping("/upload")
    public ResponseEntity<?> submit_job_position(@RequestParam("file") MultipartFile file,
        @RequestParam("jobPosition") String jobPosition){
        try {
            String email = getCurrentUserEmail();
            Long fileId = upgrade_resume_service.upload_resume(file, email, jobPosition);
           
            return ResponseEntity.ok(Map.of("fileId", fileId,
                                            "status", "PROCESSING"
            ));
        } catch (IOException e) {
           e.printStackTrace();
           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", "Failed to upload resume file"));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Unexpected server error"));
        }
           
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get_upgraded_resume(@PathVariable Long id){
        String email = getCurrentUserEmail();
        String url = upgrade_resume_service.get_presigned_url(email, id);
        return ResponseEntity.ok(Map.of("url", url,
                                        "status", "COMPLETED"
        ));
    }

  
    
}

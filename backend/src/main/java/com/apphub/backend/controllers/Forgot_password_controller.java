package com.apphub.backend.controllers;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apphub.backend.Services.Forgot_password_service;


@RestController
@RequestMapping("/api/forgot_password")
public class Forgot_password_controller {
    private final Forgot_password_service forgot_password_service;

    public Forgot_password_controller(Forgot_password_service forgot_password_service){
        this.forgot_password_service=forgot_password_service;
    }

    @PostMapping("/send_email")
    public ResponseEntity<?> send_email(@RequestBody Map<String, Object> user_email){
       String email = (String)user_email.get("email");
       if(forgot_password_service.send_email(email)){
            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
       }
        return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(Map.of("message","Email was not sent"));
    
    }

    @PostMapping("/verify_code")
    public ResponseEntity<?> verify_code(@RequestBody Map<String, Object> data){
        String code = (String) data.get("code");
        String email = (String) data.get("email");
        if(forgot_password_service.verify_code(code, email)){
            return ResponseEntity.ok(Map.of("message", "Code matches"));
        }
       
        return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(Map.of("message","Incorrect code"));
        
         
    }

    @PostMapping("/change_password")
    public ResponseEntity<?> change_password(@RequestBody Map<String, Object> data){
        try {
            String newPassword = (String) data.get("newPassword");
            String confirmNewPassword = (String) data.get("confirmNewPassword");
            String email = (String) data.get("email");
            if(forgot_password_service.change_password(newPassword, confirmNewPassword, email)){
                return ResponseEntity.ok(Map.of("message", "Password succesfully changed"));
            }
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of("message", "Passwords do not match"));
          

        } catch (Exception e) {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("message","Error changing password"));
        }
       

    }    
}

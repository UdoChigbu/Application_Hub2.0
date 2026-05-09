package com.apphub.backend.controllers;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apphub.backend.Services.Forgot_password_service;
import com.apphub.backend.dto.ForgotPasswordRequest;


@RestController
@RequestMapping("/api/forgot_password")
public class Forgot_password_controller {
    private final Forgot_password_service forgot_password_service;

    public Forgot_password_controller(Forgot_password_service forgot_password_service){
        this.forgot_password_service=forgot_password_service;
    }

    @PostMapping("/send_email")
    public ResponseEntity<?> send_email(@RequestBody ForgotPasswordRequest data){
       if(forgot_password_service.send_email(data)){
            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
       }
        return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(Map.of("message","Email was not sent"));
    
    }

    @PostMapping("/verify_code")
    public ResponseEntity<?> verify_code(@RequestBody ForgotPasswordRequest data){
        if(forgot_password_service.verify_code(data)){
            return ResponseEntity.ok(Map.of("message", "Code matches"));
        }
       
        return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(Map.of("message","Incorrect code"));
        
         
    }

    @PostMapping("/change_password")
    public ResponseEntity<?> change_password(@RequestBody ForgotPasswordRequest data){
        try {
            forgot_password_service.change_password(data);
            return ResponseEntity.ok(Map.of("message", "Password succesfully changed"));
            
        } catch (Exception e) {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("message","Code is incorrect or expired. Try again."));
        }
       

    }    
}

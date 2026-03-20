package com.apphub.backend.controllers;
import java.util.*;
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

    @PostMapping
    public ResponseEntity<?> send_email(@RequestBody Map<String, Object> user_email){
       String email = (String)user_email.get("email");
       forgot_password_service.send_email(email);
        return ResponseEntity.ok(Map.of("message", "Application saved successfully"));
        
    }
    
}

package com.apphub.backend.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apphub.backend.Services.User_service;




@RestController
@RequestMapping("/api")
public class Signup_controller {

    private final User_service user_service;
    public Signup_controller(User_service user_service){
        this.user_service=user_service;
    }

    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> user_data) {
    
System.out.println("SIGNUP HIT");
        String first=(String) user_data.get("first_name");
        String last=(String) user_data.get("last_name");
        String email=(String) user_data.get("email");
        String password=(String) user_data.get("password");
        String confirm_password=(String) user_data.get("confirm_password");

       
        if(user_service.email_exists(email)){
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("message","Email already registered"));
        }
        else if(!user_service.passwords_match(password, confirm_password)){
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of("message","Passwords do not match"));
        }
        else{
            user_service.insert_user(first, last, email, password, confirm_password);
           return ResponseEntity.ok(
            Map.of("message", "Signup successful")
        );
        }

        
       
    }
    
}

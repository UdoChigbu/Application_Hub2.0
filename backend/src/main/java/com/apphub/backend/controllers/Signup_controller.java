package com.apphub.backend.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apphub.backend.Services.User_service;
import com.apphub.backend.dto.UserRequest;




@RestController
@RequestMapping("/api")
public class Signup_controller {

    private final User_service user_service;
    public Signup_controller(User_service user_service){
        this.user_service=user_service;
    }

    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequest userData) {
    
        if(user_service.emailExists(userData)){
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("message","Email already registered"));
        }
        else if(!user_service.passwords_match(userData)){
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of("message","Passwords do not match"));
        }
        else if(user_service.password_length_invalid(userData)){
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of("message","Password must be at least 6 characters long"));
        }
        else{
            user_service.insert_user(userData);
           return ResponseEntity.ok(
            Map.of("message", "Signup successful")
        );
        }

        
       
    }
    
}

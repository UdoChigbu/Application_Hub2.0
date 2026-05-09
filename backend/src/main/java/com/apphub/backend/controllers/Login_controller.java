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
import com.apphub.backend.models.User;
import com.apphub.backend.security.CustomUserDetailsService;
import com.apphub.backend.security.JwtService;

@RestController
@RequestMapping("/api")

public class Login_controller {
    private final User_service user_service;
   

    public Login_controller(User_service user_service, JwtService jwtService, CustomUserDetailsService customUserDetailsService){
        this.user_service=user_service;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest userData){
    

        User user= user_service.login_user(userData);
        if(user!=null){
            String token = user_service.generateToken(userData);
           return ResponseEntity.ok(
            Map.of("first_name", user.getFirst(),
            "userId", user.getID(),
            "token", token
        ));
        }
        else {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("message","Wrong password or email doesn't exist please try again."));
        }



    }
    
}

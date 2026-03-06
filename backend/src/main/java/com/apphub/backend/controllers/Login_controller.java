package com.apphub.backend.controllers;

import java.util.Map;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.apphub.backend.Services.User_service;
import com.apphub.backend.models.User;

@RestController
@RequestMapping("/api")

public class Login_controller {
    private final User_service user_service;
    

    public Login_controller(User_service user_service){
        this.user_service=user_service;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> user_data){
    
      
        String email= (String)user_data.get("email");
        String password= (String)user_data.get("password");

        User user = user_service.login_user(email, password);
        if(user!=null){
           return ResponseEntity.ok(
            Map.of("first_name", user.getFirst())
            );
        }
        else {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("message","Wrong password or email doesn't exist please try again."));
        }



    }
    
}

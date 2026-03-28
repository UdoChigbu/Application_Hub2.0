package com.apphub.backend.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apphub.backend.Services.Events_service;
import com.apphub.backend.dto.Events_request;

@RestController
@RequestMapping("/api/events")
public class Events_controller {
    private final Events_service events_service;

   

    public Events_controller(Events_service events_service){
        this.events_service = events_service;
    }

    @PostMapping("/create_event")
    public ResponseEntity<?> create_event (@RequestBody Events_request request){
        if(events_service.create_event(request)){
            return ResponseEntity.ok(Map.of("message", "Event created"));
        }
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Event was not created"));
    }
    
}

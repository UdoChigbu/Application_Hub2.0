package com.apphub.backend.controllers;

import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.apphub.backend.Services.Events_service;
import com.apphub.backend.dto.Events_request;
import com.apphub.backend.models.Event;

@RestController
@RequestMapping("/api/events")
public class Events_controller {
    private final Events_service events_service;

   

    public Events_controller(Events_service events_service){
        this.events_service = events_service;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @PostMapping("/create_event")
    public ResponseEntity<?> create_event (@RequestBody Events_request request){
        String email = getCurrentUserEmail();
        if(events_service.create_event(email, request)){
            return ResponseEntity.ok(Map.of("message", "Event created"));
        }
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Event was not created"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> get_events(){
        try{
             String email = getCurrentUserEmail();
             List <Event> events = events_service.get_events_by_email(email);
             return ResponseEntity.ok(events==null? new ArrayList<>(): events);
        
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message", "Backend error while fetching events",
                        "error", e.getMessage()
                ));
            }  
        }
      
    

    @GetMapping("/{id}")
    public ResponseEntity<?> get_event_by_id(@PathVariable Long id){
        String email = getCurrentUserEmail();
        Events_request event_request = events_service.get_event_by_id(email, id);
        if(event_request !=null){
            return ResponseEntity.ok(event_request);
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Event not found with id: " + id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update_event(@PathVariable Long id, @RequestBody Events_request request){
       String email = getCurrentUserEmail();
       if(events_service.update_event(email, id, request)) {
        return ResponseEntity.ok(Map.of("message", "Event updated successfully"));
       }
       return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Event not found with id: " + id));

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete_event (@PathVariable Long id){
        String email = getCurrentUserEmail();
        if(events_service.delete_event(email, id)){
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Event not found with id: " + id));
    }
    
}

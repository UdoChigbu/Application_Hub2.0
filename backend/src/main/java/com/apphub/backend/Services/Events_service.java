package com.apphub.backend.Services;

import com.apphub.backend.models.User;

import org.springframework.stereotype.Service;

import com.apphub.backend.dto.Events_request;
import com.apphub.backend.models.Events;
import com.apphub.backend.repositories.Events_repository;
import com.apphub.backend.repositories.User_repository;

@Service
public class Events_service {

    private final User_repository user_repository;
    private final Events_repository events_repository;
    

    public Events_service(User_repository user_repository, Events_repository events_repository){
        this.user_repository = user_repository;
        this.events_repository = events_repository;
    }


    public Boolean create_event(Events_request request){
        User user = user_repository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Events event = new Events(
            request.getTitle(),
            request.getLocation(),
            request.getDate(),
            request.getStartTime(),
            request.getNotes()
            );
        event.setUser(user);
        return events_repository.save(event) !=null;
    }







}

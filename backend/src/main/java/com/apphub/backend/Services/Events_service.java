package com.apphub.backend.Services;

import com.apphub.backend.models.User;

import java.util.List;


import org.springframework.stereotype.Service;

import com.apphub.backend.dto.Events_request;
import com.apphub.backend.models.Event;
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


    public Boolean create_event(String email, Events_request request){
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Event event = new Event(
            request.getTitle(),
            request.getLocation(),
            request.getDate(),
            request.getStartTime(),
            request.getNotes()
            );
        event.setUser(user);
        return events_repository.save(event) !=null;
    }

    public List<Event> get_events_by_email(String email){
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return events_repository.getEventsByUser(user);

    }

    public Events_request get_event_by_id(String email, Long id){
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Event event = events_repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!user.getID().equals(event.getUser().getID())) {
            throw new RuntimeException("Unauthorized access");
        }

        Long userId = event.getUser().getID(); 
        return new Events_request(
                event.getTitle(),
                event.getLocation(),
                event.getDate(),
                event.getStartTime(),
                event.getNotes(),
                userId,
                id
            );

    }

    public Boolean update_event(String email, Long id, Events_request request){
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Event event = events_repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!user.getID().equals(event.getUser().getID())) {
            throw new RuntimeException("Unauthorized access");
        }
    
        event.setTitle(request.getTitle());
        event.setLocation(request.getLocation());
        event.setDate(request.getDate());
        event.setStartTime(request.getStartTime());
        event.setNotes(request.getNotes());

        return (events_repository.save(event)!=null);
        
    }

    public Boolean delete_event(String email, Long id){
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Event event = events_repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!user.getID().equals(event.getUser().getID())) {
            throw new RuntimeException("Unauthorized access");
        }

        events_repository.deleteById(id);
        return true;
    }
            






}
    









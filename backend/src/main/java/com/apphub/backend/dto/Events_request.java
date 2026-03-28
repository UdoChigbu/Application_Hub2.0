package com.apphub.backend.dto;

import java.time.LocalDate;

import java.time.LocalTime;

public class Events_request {
    private Long id;
    private Long userId;
    private String title;
    private String location;
    private LocalDate date;
    private LocalTime startTime;
    private String notes;

    public Long getId(){
        return id;
    }

    public Long getUserId(){
        return userId;
    }

    public String getLocation(){
        return location;
    }
    
    public LocalDate getDate(){
        return date;
    }

    

    public String getTitle(){
        return title;
    }

    public LocalTime getStartTime(){
        return startTime;
    }

    public String getNotes(){
        return notes;
    }

    public void setLocation(String location){
        this.location = location;
    }

    public void setDate(LocalDate date){
        this.date = date;
    }

    public void setId(Long id){
        this.id = id;
    }

    public void setUserId(Long userId){
        this.userId=userId;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setStartTime(LocalTime startTime){
        this.startTime = startTime;
    }

    public void setNotes(String notes){
        this.notes = notes;
    }
     
    
}

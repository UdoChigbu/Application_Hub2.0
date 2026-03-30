package com.apphub.backend.models;

import java.time.LocalDate;

import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name="Events")
public class Events {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;


    private String title;
    private String location;
    private LocalDate date;
    private LocalTime startTime;
    private String notes;

    public Events(){}

    public Events(String title,  String location, LocalDate date, LocalTime startTime, String notes){
        this.title = title;
        this.location = location;
        this.date = date;
        this.startTime = startTime;
        this.notes = notes;
    }

    public Long getId(){
        return id;
    }

    public User getUser(){
        return user;
    }

    public String getTitle(){
        return title;
    }

     public String getLocation(){
        return location;
    }

     public LocalDate getDate(){
        return date;
    }


    public LocalTime getStartTime(){
        return startTime;
    }

    public String getNotes(){
        return notes;
    }

    public void setId(Long id){
        this.id = id;
    }

    public void setUser(User user){
        this.user=user;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setLocation(String location){
        this.location = location;
    }

     public void setDate(LocalDate date){
        this.date = date;
    }


    public void setStartTime(LocalTime startTime){
        this.startTime = startTime;
    }

    public void setNotes(String notes){
        this.notes = notes;
    }
    
}

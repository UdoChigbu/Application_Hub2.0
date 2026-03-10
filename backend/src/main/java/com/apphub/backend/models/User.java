package com.apphub.backend.models;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name="Users")
public class User {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String first;
    private String last;
    private String email;
    private String password;
    
     @OneToMany(mappedBy = "user")
    private List<Application> applications;


    public User(String first, String last, String email, String password){
        this.first= first;
        this.last=last;
        this.email=email;
        this.password=password;
       
    }

    public User(){}

    public Long getID(){return id;}
    
    public void setFirst(String first){
        this.first=first;
    }
    public String getFirst(){return first;}

    public void setLast(String last){
        this.last=last;
    }
    public String getLast(){return last;}


    public void setEmail(String email){
        this.email=email;
    }
    public String getEmail(){return email;}

    public void setPassword(String password){
        this.password=password;
    }
    public String getPassword(){return password;}

   

}

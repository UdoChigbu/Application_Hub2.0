package com.apphub.backend.models;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name="Password_reset_tokens")
public class Forgot_password_token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String email;
    private String code;
    private LocalDateTime expirationTime;

    public Forgot_password_token(){}
  

    public Forgot_password_token( String code, LocalDateTime expirationTime, User user, String email){
        this.code = code;
        this.expirationTime = expirationTime;
        this.user = user;
        this.email = email;
        
    }



    public String getEmail(){
        return email;
    }


    public String getCode(){
        return code;
    }

    public LocalDateTime getExpirationTime(){
        return expirationTime;

    }

    public void setEmail(String email){
        this.email=email;
    }

    public void setCode(String code){
        this.code=code;
    }

    public void setExpirationTime(LocalDateTime expirationTime){
        this.expirationTime = expirationTime;
    }





    
}

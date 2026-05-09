package com.apphub.backend.dto;


public class UserRequest {

    private String first;
    private String last;
    private String email;
    private String password;
    private String confirmPassword;

    
    public void setFirst(String first){this.first=first;}
    public void setLast(String last){this.last=last;}
    public void setEmail(String email){this.email=email;}
    public void setPassword(String password){this.password=password;}
    public void setConfirmPassword(String confirmPassword){this.confirmPassword=confirmPassword;}

    public String getFirst(){return first;}
    public String getLast(){return last;}
    public String getEmail(){return email;}
    public String getPassword(){return password;}
    public String getConfirmPassword(){return confirmPassword;}

    
}

package com.apphub.backend.dto;

public class ForgotPasswordRequest {
    private String email;
    private String code;
    private String newPassword;
    private String confirmNewPassword;
   
    public String getEmail() { return email; }
    public String getCode() { return code; }
    public String getNewPassword() { return newPassword; }
    public String getConfirmNewPassword() { return confirmNewPassword; }

    public void setEmail(String email) { this.email = email; }
    public void setCode(String code) { this.code = code; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    public void setConfirmNewPassword(String confirmNewPassword) { this.confirmNewPassword = confirmNewPassword; }
    
}

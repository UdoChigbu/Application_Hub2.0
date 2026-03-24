package com.apphub.backend.Services;
import com.apphub.backend.repositories.Password_reset_repository;
import com.apphub.backend.repositories.User_repository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.apphub.backend.models.Forgot_password_token;
import com.apphub.backend.models.User;

import java.time.LocalDateTime;
import java.util.Random;



@Service
@Transactional
public class Forgot_password_service {



    private final Password_reset_repository password_reset_repository;

    private final User_repository user_repository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    public Forgot_password_service(User_repository user_repository, Password_reset_repository password_reset_repository){
        this.user_repository = user_repository;
        this.password_reset_repository = password_reset_repository;
       
    
    }

    
    public Boolean send_email (String email){
        String code=code_generator();
       
        Forgot_password_token token = create_token(email, code);
        if(token!=null){
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom(fromEmail);
            message.setSubject("Application Hub reset code");
            message.setText("Hi,\n\n We received a request to reset your password for your account. Use the code to reset your password:\n\n "
            +code+"\n\n"+"This code will expire in ten minutes for security reasons.\n\n Best regards,\n Application Hub Team");
            mailSender.send(message);
            return true;
            }

            return false;
           
    }


    public Forgot_password_token create_token(String email, String code){
        User user =  user_repository.findByEmail(email);
        if(user==null){
            throw new RuntimeException("User not found");
            //user doesnt have an account
        }
        password_reset_repository.deleteByUser(user);
        String hashCode =  passwordEncoder.encode(code);
        Forgot_password_token token =  new Forgot_password_token(hashCode, LocalDateTime.now().plusMinutes(10), user, email);
        return password_reset_repository.save(token);
    }

    public String code_generator(){
        String code = String.format("%06d", new Random().nextInt(1_000_000));
        return code;
    }

    public Boolean verify_code(String code, String email){
        Forgot_password_token token = password_reset_repository.getByEmail(email);
        String storedCode = token.getCode();
        return passwordEncoder.matches(code, storedCode);
    }

    public Boolean change_password(String newPassword, String confirmNewPassword, String email){
        if(newPassword.equals(confirmNewPassword)){
            User user = user_repository.findByEmail(email);
            String hashedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(hashedPassword);
            user_repository.save(user);

            return true;
        }
        
        return false;

    }

   

}

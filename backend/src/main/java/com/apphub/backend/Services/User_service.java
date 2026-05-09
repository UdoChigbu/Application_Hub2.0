package com.apphub.backend.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.apphub.backend.dto.UserRequest;
import com.apphub.backend.models.User;
import com.apphub.backend.repositories.User_repository;
import com.apphub.backend.security.CustomUserDetailsService;
import com.apphub.backend.security.JwtService;

@Service
public class User_service {

    @Autowired
    private PasswordEncoder password_encoder;
    private final User_repository user_repository;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;

    public User_service(User_repository user_repository, CustomUserDetailsService customUserDetailsService, JwtService jwtService){
        this.user_repository=user_repository;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
    }



    public void insert_user(UserRequest userData){
        String password = userData.getPassword();
        String first = userData.getFirst();
        String last = userData.getLast();
        String email = userData.getEmail();
        String hashed_password = password_encoder.encode(password);
        User user= new User(first, last, email, hashed_password);
        user_repository.save(user);
        
    }

    public boolean emailExists(UserRequest userData ){
       //if email exists return true else return false
        return user_repository.existsByEmail(userData.getEmail());
    }

    public boolean passwords_match(UserRequest userData){
        // return true if pw's match else return false
        return userData.getPassword().equals(userData.getConfirmPassword());
    }

    public boolean password_length_invalid(UserRequest userData){
        // return true if pw is less than 6 characters else return false
        return userData.getPassword().length() < 6 || userData.getConfirmPassword().length() < 6;
    }

    public User login_user(UserRequest userData){
        String email = userData.getEmail();
        String password = userData.getPassword();
        User user= user_repository.findByEmail(email);
    
        //if user is not null and pw is correct return user details
        if(user!=null && password_encoder.matches(password,user.getPassword())){
            return user;
        }
        return null;
        
    }

    public String generateToken(UserRequest userData){
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(userData.getEmail());
        return jwtService.generateToken(userDetails);
    }


}

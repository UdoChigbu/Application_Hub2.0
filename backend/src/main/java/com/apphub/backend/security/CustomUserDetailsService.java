package com.apphub.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.apphub.backend.models.User;
import com.apphub.backend.repositories.User_repository;

@Service
public class CustomUserDetailsService implements UserDetailsService{

    private final User_repository user_repository;

    public CustomUserDetailsService(User_repository user_repository){
        this.user_repository = user_repository;
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user = user_repository.findByEmail(email);
        if(user == null){
            throw new UsernameNotFoundException("User not found");
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();

    }

    
}

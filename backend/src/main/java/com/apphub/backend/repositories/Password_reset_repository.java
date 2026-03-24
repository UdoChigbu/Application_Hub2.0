package com.apphub.backend.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import com.apphub.backend.models.Forgot_password_token;
import com.apphub.backend.models.User;

public interface Password_reset_repository extends JpaRepository<Forgot_password_token, Long>{
    Boolean existsByUser(User user);
    void deleteByUser(User user);

    Forgot_password_token getByEmail(String email);
    

}
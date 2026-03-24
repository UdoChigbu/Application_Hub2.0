package com.apphub.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.apphub.backend.models.User;

@Repository
public interface User_repository extends JpaRepository <User, Long>{
    Boolean existsByEmail(String email);
    User findByEmail(String email);
  
}

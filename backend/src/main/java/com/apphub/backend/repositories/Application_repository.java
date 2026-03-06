package com.apphub.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.apphub.backend.models.Application;

public interface Application_repository extends JpaRepository<Application, Long> {
}
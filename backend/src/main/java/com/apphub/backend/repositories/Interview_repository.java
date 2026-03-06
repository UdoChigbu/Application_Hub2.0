package com.apphub.backend.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apphub.backend.models.Interview;

public interface Interview_repository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationId(Long applicationId);
    List<Interview> findByInterviewDateGreaterThanEqualOrderByInterviewDateAsc(LocalDate date);
}
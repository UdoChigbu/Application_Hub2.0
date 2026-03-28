package com.apphub.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apphub.backend.models.Events;

public interface Events_repository extends JpaRepository<Events, Long> {

}

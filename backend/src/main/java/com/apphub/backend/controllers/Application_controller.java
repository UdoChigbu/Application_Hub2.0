package com.apphub.backend.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apphub.backend.Services.Application_service;
import com.apphub.backend.models.Application;

@RestController
@RequestMapping("/api/applications")
public class Application_controller {

    private final Application_service application_service;

    public Application_controller(Application_service application_service) {
        this.application_service = application_service;
    }

    @PostMapping
    public ResponseEntity<?> create_application(@RequestBody Application application) {
        Application created = application_service.create_application(application);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Application>> get_all_applications() {
        return ResponseEntity.ok(application_service.get_all_applications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get_application_by_id(@PathVariable Long id) {
        Application application = application_service.get_application_by_id(id);

        if (application != null) {
            return ResponseEntity.ok(application);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Application not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update_application(@PathVariable Long id, @RequestBody Application updated_application) {
        Application application = application_service.update_application(id, updated_application);

        if (application != null) {
            return ResponseEntity.ok(application);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Application not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete_application(@PathVariable Long id) {
        boolean deleted = application_service.delete_application(id);

        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Application deleted successfully"));
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Application not found"));
    }
}
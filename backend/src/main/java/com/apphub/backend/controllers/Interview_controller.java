package com.apphub.backend.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apphub.backend.Services.Interview_service;
import com.apphub.backend.models.Interview;

@RestController
@RequestMapping("/api")
public class Interview_controller {

    private final Interview_service interview_service;

    public Interview_controller(Interview_service interview_service) {
        this.interview_service = interview_service;
    }

    @PostMapping("/applications/{applicationId}/interviews")
    public ResponseEntity<?> create_interview_for_application(@PathVariable Long applicationId,
                                                              @RequestBody Interview interview) {
        Interview created = interview_service.create_interview_for_application(applicationId, interview);

        if (created != null) {
            return ResponseEntity.ok(created);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Application not found"));
    }

    @GetMapping("/applications/{applicationId}/interviews")
    public ResponseEntity<List<Interview>> get_interviews_by_application(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interview_service.get_interviews_by_application_id(applicationId));
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Interview>> get_all_interviews() {
        return ResponseEntity.ok(interview_service.get_all_interviews());
    }

    @GetMapping("/interviews/{id}")
    public ResponseEntity<?> get_interview_by_id(@PathVariable Long id) {
        Interview interview = interview_service.get_interview_by_id(id);

        if (interview != null) {
            return ResponseEntity.ok(interview);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Interview not found"));
    }

    @PutMapping("/interviews/{id}")
    public ResponseEntity<?> update_interview(@PathVariable Long id, @RequestBody Interview updatedInterview) {
        Interview interview = interview_service.update_interview(id, updatedInterview);

        if (interview != null) {
            return ResponseEntity.ok(interview);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Interview not found"));
    }

    @DeleteMapping("/interviews/{id}")
    public ResponseEntity<?> delete_interview(@PathVariable Long id) {
        boolean deleted = interview_service.delete_interview(id);

        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Interview deleted successfully"));
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Interview not found"));
    }

    @GetMapping("/interviews/upcoming")
    public ResponseEntity<List<Interview>> get_upcoming_interviews() {
        return ResponseEntity.ok(interview_service.get_upcoming_interviews());
    }
}
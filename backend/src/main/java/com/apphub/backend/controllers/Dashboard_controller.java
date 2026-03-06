package com.apphub.backend.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apphub.backend.Services.Application_service;
import com.apphub.backend.Services.Interview_service;

@RestController
public class Dashboard_controller {

    private final Application_service application_service;
    private final Interview_service interview_service;

    public Dashboard_controller(Application_service application_service,
                                Interview_service interview_service) {
        this.application_service = application_service;
        this.interview_service = interview_service;
    }

    @GetMapping("/api/dashboard/stats")
    public ResponseEntity<Map<String, Long>> get_dashboard_stats() {
        long totalApplications = application_service.get_all_applications().size();
        long totalInterviews = interview_service.get_total_interviews();

        return ResponseEntity.ok(
                Map.of(
                        "totalApplications", totalApplications,
                        "totalInterviews", totalInterviews
                )
        );
    }
}
package com.apphub.backend.Services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.apphub.backend.models.Application;
import com.apphub.backend.models.Interview;
import com.apphub.backend.repositories.Application_repository;
import com.apphub.backend.repositories.Interview_repository;

@Service
public class Interview_service {

    private final Interview_repository interview_repository;
    private final Application_repository application_repository;

    public Interview_service(Interview_repository interview_repository,
                             Application_repository application_repository) {
        this.interview_repository = interview_repository;
        this.application_repository = application_repository;
    }

    public Interview create_interview_for_application(Long applicationId, Interview interview) {
        Optional<Application> applicationOptional = application_repository.findById(applicationId);

        if (applicationOptional.isPresent()) {
            Application application = applicationOptional.get();
            interview.setApplication(application);
            return interview_repository.save(interview);
        }

        return null;
    }

    public List<Interview> get_all_interviews() {
        return interview_repository.findAll();
    }

    public List<Interview> get_interviews_by_application_id(Long applicationId) {
        return interview_repository.findByApplicationId(applicationId);
    }

    public Interview get_interview_by_id(Long id) {
        Optional<Interview> interview = interview_repository.findById(id);
        return interview.orElse(null);
    }

    public Interview update_interview(Long id, Interview updatedInterview) {
        Optional<Interview> existing = interview_repository.findById(id);

        if (existing.isPresent()) {
            Interview interview = existing.get();
            interview.setCompany(updatedInterview.getCompany());
            interview.setJobTitle(updatedInterview.getJobTitle());
            interview.setInterviewDate(updatedInterview.getInterviewDate());
            interview.setInterviewTime(updatedInterview.getInterviewTime());
            interview.setInterviewType(updatedInterview.getInterviewType());
            interview.setLocation(updatedInterview.getLocation());
            interview.setStatus(updatedInterview.getStatus());
            interview.setNotes(updatedInterview.getNotes());
            return interview_repository.save(interview);
        }

        return null;
    }

    public boolean delete_interview(Long id) {
        if (interview_repository.existsById(id)) {
            interview_repository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Interview> get_upcoming_interviews() {
        return interview_repository.findByInterviewDateGreaterThanEqualOrderByInterviewDateAsc(LocalDate.now());
    }

    public long get_total_interviews() {
        return interview_repository.count();
    }
}
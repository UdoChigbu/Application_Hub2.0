package com.apphub.backend.Services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.apphub.backend.dto.Application_Request;
import com.apphub.backend.models.Application;
import com.apphub.backend.models.User;
import com.apphub.backend.repositories.Application_repository;
import com.apphub.backend.repositories.User_repository;


@Service
public class Application_service {

    private final Application_repository application_repository;
    private final User_repository user_repository;

    public Application_service(Application_repository application_repository, User_repository user_repository) {
        this.application_repository = application_repository;
        this.user_repository = user_repository;
    }

    public Boolean create_application(String email, Application_Request request) {
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
       
        Application application = new Application(
                request.getJobTitle(),
                request.getCompany(),
                request.getStatus(),
                request.getDateApplied(),
                request.getDeadline(),
                request.getLocation(),
                request.getNotes()
        );
        application.setUser(user);
        return application_repository.save(application) != null;
    }


    public Application get_application_by_id(String email, Long id) {
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Application app = application_repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!user.getID().equals(app.getUser().getID())) {
            throw new RuntimeException("Unauthorized access");
        }
        return app;
    }

    // New: get all applications for a specific user
    public List<Application> get_applications_by_email(String email) {
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return application_repository.findByUserId(user.getID());
    }

    public Application update_application(String email, Long id, Application updated_application) {
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Application app = application_repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!user.getID().equals(app.getUser().getID())) {
            throw new RuntimeException("Unauthorized access");
        }
        app.setJobTitle(updated_application.getJobTitle());
        app.setCompany(updated_application.getCompany());
        app.setStatus(updated_application.getStatus());
        app.setDateApplied(updated_application.getDateApplied());
        app.setDeadline(updated_application.getDeadline());
        app.setLocation(updated_application.getLocation());
        app.setNotes(updated_application.getNotes());
        return application_repository.save(app);
    
    }

    public boolean delete_application(String email, Long id) {
        User user = user_repository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Application app = application_repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!user.getID().equals(app.getUser().getID())) {
            throw new RuntimeException("Unauthorized access");
        }

        application_repository.deleteById(id);
        return true;
        
    }
}
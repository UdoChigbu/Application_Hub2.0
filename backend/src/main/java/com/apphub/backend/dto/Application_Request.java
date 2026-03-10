package com.apphub.backend.dto;

import java.time.LocalDate;


public class Application_Request {
   private String jobTitle;
    private String company;
    private String status;
    private LocalDate dateApplied;
    private LocalDate deadline;
    private String location;
    private String notes;
    private Long userId;

    public String getJobTitle() { return jobTitle; }
    public String getCompany() { return company; }
    public String getStatus() { return status; }
    public LocalDate getDateApplied() { return dateApplied; }
    public LocalDate getDeadline() { return deadline; }
    public String getLocation() { return location; }
    public String getNotes() { return notes; }
    public Long getUserId() { return userId; }

    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public void setCompany(String company) { this.company = company; }
    public void setStatus(String status) { this.status = status; }
    public void setDateApplied(LocalDate dateApplied) { this.dateApplied = dateApplied; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public void setLocation(String location) { this.location = location; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setUserId(Long userId) { this.userId = userId; }
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Add_application.css";

function Add_interview() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  localStorage.setItem("formType", "interview");

  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    applicationId: "",
    company: "",
    jobTitle: "",
    interviewDate: "",
    interviewTime: "",
    interviewType: "",
    location: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/applications/user/${userId}`
        );
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { applicationId, ...interviewData } = formData;

    try {
      const response = await fetch(
        `http://localhost:8081/api/applications/${applicationId}/interviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(interviewData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate("/Succesfully_submitted");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="Add_application_background">
      <h1>Create New Interview</h1>
      <div className="job_info_section">
        <p className="section_header">Interview information</p>

        <form id="interview_form" onSubmit={handleSubmit}>

          <div className="application_boxes">
            <label htmlFor="applicationId">Linked application</label>
            <select
              name="applicationId"
              id="applicationId"
              className="status"
              value={formData.applicationId}
              onChange={handleChange}
              required
            >
              <option value="">Select an application</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.jobTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="application_boxes">
            <label htmlFor="company_name">Company name</label>
            <input
              type="text"
              name="company"
              placeholder="Enter company name"
              id="company_name"
              className="text_box"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="application_boxes">
            <label htmlFor="job_title">Job title</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              id="job_title"
              className="text_box"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>

          <div className="application_boxes">
            <label htmlFor="interview_date">Interview date</label>
            <input
              type="date"
              name="interviewDate"
              id="interview_date"
              className="text_box"
              value={formData.interviewDate}
              onChange={handleChange}
            />
          </div>

          <div className="application_boxes">
            <label htmlFor="interview_time">Interview time</label>
            <input
              type="time"
              name="interviewTime"
              id="interview_time"
              className="text_box"
              value={formData.interviewTime}
              onChange={handleChange}
            />
          </div>

          <div className="application_boxes">
            <label htmlFor="interview_type">Interview type</label>
            <select
              name="interviewType"
              id="interview_type"
              className="status"
              value={formData.interviewType}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Video Call">Video Call</option>
              <option value="On-site">On-site</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Final Round">Final Round</option>
            </select>
          </div>

          <div className="application_boxes">
            <label htmlFor="location">Location / Meeting link</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Zoom link or office address"
              id="location"
              className="text_box"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="application_boxes">
            <label htmlFor="status" className="status_label">Status</label>
            <select
              name="status"
              id="status"
              className="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="application_boxes">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Add any notes about the interview..."
              className="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="save_cancel_box">
            <button
              type="button"
              className="application_page_buttons"
              onClick={() => navigate("/Dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="application_page_buttons">
              Save Interview
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Add_interview;
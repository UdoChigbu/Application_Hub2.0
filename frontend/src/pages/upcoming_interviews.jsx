import "../styles/Manage_applications.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Upcoming_interviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/interviews`);
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) return;
    try {
      const response = await fetch(`http://localhost:8081/api/interviews/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setInterviews(interviews.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (interview) => {
    setEditingId(interview.id);
    setEditFormData({
      company: interview.company,
      jobTitle: interview.jobTitle,
      interviewDate: interview.interviewDate,
      interviewTime: interview.interviewTime,
      interviewType: interview.interviewType,
      location: interview.location,
      status: interview.status,
      notes: interview.notes,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/interviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      if (response.ok) {
        setEditingId(null);
        fetchInterviews();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Manage_applications_background">
      <h1>Your Interviews</h1>
      <div className="quick_actions_box">
        <button
          type="button"
          className="quick_actions_btn"
          onClick={() => navigate("/Add_interview")}
        >
          Add new interview.
        </button>
        <button
          type="button"
          className="quick_actions_btn"
          onClick={() => navigate("/Dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="table_box_background">
        <div className="table_box">
          <tbody>
            {interviews.length === 0 ? (
              <tr>
                <td>No interviews found.</td>
              </tr>
            ) : (
              interviews.map((interview) =>
                editingId === interview.id ? (
                
                  <tr key={interview.id}>
                    <td>
                      <input
                        type="text"
                        name="company"
                        value={editFormData.company}
                        onChange={handleEditChange}
                        className="text_box"
                        placeholder="Company"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="jobTitle"
                        value={editFormData.jobTitle}
                        onChange={handleEditChange}
                        className="text_box"
                        placeholder="Job Title"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="interviewDate"
                        value={editFormData.interviewDate}
                        onChange={handleEditChange}
                        className="text_box"
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        name="interviewTime"
                        value={editFormData.interviewTime}
                        onChange={handleEditChange}
                        className="text_box"
                      />
                    </td>
                    <td>
                      <select
                        name="interviewType"
                        value={editFormData.interviewType}
                        onChange={handleEditChange}
                        className="status"
                      >
                        <option value="Phone Screen">Phone Screen</option>
                        <option value="Video Call">Video Call</option>
                        <option value="On-site">On-site</option>
                        <option value="Technical">Technical</option>
                        <option value="Behavioral">Behavioral</option>
                        <option value="Final Round">Final Round</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditChange}
                        className="status"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditChange}
                        className="text_box"
                        placeholder="Location"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="notes"
                        value={editFormData.notes}
                        onChange={handleEditChange}
                        className="text_box"
                        placeholder="Notes"
                      />
                    </td>
                    <td>
                      <button
                        className="quick_actions_btn"
                        onClick={() => handleEditSave(interview.id)}
                      >
                        Save
                      </button>
                      <button
                        className="quick_actions_btn"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                 
                  <tr key={interview.id}>
                    <td>{interview.company}</td>
                    <td>{interview.jobTitle}</td>
                    <td>{interview.interviewDate}</td>
                    <td>{interview.interviewTime}</td>
                    <td>{interview.interviewType}</td>
                    <td>{interview.status}</td>
                    <td>{interview.location}</td>
                    <td>{interview.notes}</td>
                    <td>
                      <button
                        className="quick_actions_btn"
                        onClick={() => handleEditClick(interview)}
                      >
                        Edit
                      </button>
                      <button
                        className="quick_actions_btn"
                        onClick={() => handleDelete(interview.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </div>
      </div>
    </div>
  );
}

export default Upcoming_interviews;
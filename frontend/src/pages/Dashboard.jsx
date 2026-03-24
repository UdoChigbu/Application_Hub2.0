import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function Dashboard() {
  const first_name = localStorage.getItem("first_name");
  const userId = localStorage.getItem("userId");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    pending: 0,
  });

  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingInterviews, setLoadingInterviews] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchUpcomingInterviews();
  }, []);

  const fetchStats = async () => {
    try {
      const appRes = await fetch(
        `http://localhost:8081/api/applications/user/${userId}`
      );
      const applications = await appRes.json();

      setStats({
        applications: applications.length,
        interviews: applications.filter((app) => app.status === "Interview").length,
        pending: applications.filter((app) => app.status === "Applied").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUpcomingInterviews = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/interviews/upcoming`);
      const data = await res.json();
      setUpcomingInterviews(data);
    } catch (error) {
      console.error("Error fetching upcoming interviews:", error);
    } finally {
      setLoadingInterviews(false);
    }
  };

  const handleDateClick = (info) => {
    const title = prompt("Enter event name:");
    if (title) {
      setEvents([...events, { title, date: info.dateStr }]);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard_background">
      <h1>Application Hub</h1>
      <p className="welcome_message">Welcome, {first_name}👋</p>

      <div className="quick_actions_box">
        <button
          type="button"
          className="quick_actions_btn"
          onClick={() => navigate("/Add_application")}
        >
          Add new application.
        </button>
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
          onClick={() => {
            const title = prompt("Enter event name:");
            const date = prompt("Enter event date (YYYY-MM-DD):");
            if (title && date) {
              setEvents([...events, { title, date }]);
            }
          }}
        >
          Add new event.
        </button>
      </div>

      <Link to="/Manage_applications" className="app_card_link">
        <div className="application_card">
          <h2>📄Your applications</h2>
          <p>View and manage your applications</p>
        </div>
      </Link>

      <Link to="/upcoming_interviews" className="upcoming_interviews_link">
        <div className="interviews_card">
          <h2>💻Your interviews</h2>
          <p>View and manage your interviews</p>
        </div>
      </Link>

      <div className="application_calendar">
        <h3>📅 My Schedule</h3>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          contentHeight="auto"
          events={events}
          dateClick={handleDateClick}
        />
      </div>

      <div className="stats_box">
        {loadingStats ? (
          <p>Loading stats...</p>
        ) : (
          <>
            <p><span className="stat_number">{stats.applications}</span> 📄 Applications</p>
            <p><span className="stat_number">{stats.interviews}</span> 🎤 Interviews</p>
            <p><span className="stat_number">{stats.pending}</span> ⏳ Pending</p>
          </>
        )}
      </div>

      <div className="upcoming_interviews">
        <p className="upcoming_title">Upcoming Events</p>
        {loadingInterviews ? (
          <p>Loading...</p>
        ) : upcomingInterviews.length === 0 ? (
          <p className="no_events">No upcoming interviews scheduled.</p>
        ) : (
          upcomingInterviews.map((interview) => (
            <div key={interview.id} className="upcoming_interview_item">
              <p className="interview_company">
                {interview.company} — {interview.jobTitle}
              </p>
              <p className="interview_details">
                📅 {formatDate(interview.interviewDate)}{" "}
                {interview.interviewTime && `at ${interview.interviewTime}`}
              </p>
              <p className="interview_type">{interview.interviewType}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
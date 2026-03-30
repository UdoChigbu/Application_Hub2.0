import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


function Dashboard() {
  const first_name = localStorage.getItem("first_name");
  const userId = Number(localStorage.getItem("userId"));
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const navigate = useNavigate();

 
//checks all the days of the month and selcts the days that have events
  const dayCellClassNames = (arg)=>{
    const date = arg.date.toISOString().split("T")[0];
    const hasEventOnDay = events.some(event =>
    event.date?.slice(0, 10) === date
    );

    return hasEventOnDay ? ["has_event"] : [];
  };

  //Checks if events are in an array
  useEffect(()=>{
   const storedEvents = localStorage.getItem("events");
   const parsedEvents = storedEvents ? JSON.parse(storedEvents) : [];
   const userEvents = parsedEvents.filter(e=> e.userId ===userId);

    setEvents(userEvents);
   // localStorage.removeItem("events");
    
  }, [userId]);

   //shows only the events of the current month for a specific user
  const eventsThisMonth = events.filter(event=> event.date?.startsWith(currentMonth));

  // maps the events to the format required by full calendar
  const calendarEvents = events.map( event => ({
    title: event.title,
    start: event.date
  }));

  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    applied: 0,
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
        applied: applications.filter((app) => app.status === "Applied").length,
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
    const date = info.dateStr;
    navigate(`/Add_event/${date}`);
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
          onClick={() => navigate("/ai_resume")}
        >
          Upgrade your resume with AI.
        </button>
       
      </div>

      <Link to="/Manage_applications" className="app_card_link">
        <div className="application_card">
          <h2>📄Your applications</h2>
          <p>View and manage your applications</p>
        </div>
      </Link>

      <Link to="/Manage_events" className="events_card_link">
        <div className="events_card">
          <h2>💻Your Events</h2>
          <p>View and manage your Events</p>
        </div>
      </Link>

      {eventsThisMonth.length === 0 &&(<p className="calendar_hint"> No events this month. Click a day to add one!</p>)}
      <div className="application_calendar">
        <h3>📅 My Schedule</h3>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          contentHeight="auto"
          events={calendarEvents}
          dateClick={handleDateClick}
          dayCellClassNames={dayCellClassNames}
          datesSet={(arg)=>{
            const month = arg.view.currentStart.toISOString().slice(0, 7);
            setCurrentMonth(month);
          }}
        />
      </div>

      <div className="stats_box">
        {loadingStats ? (
          <p>Loading stats...</p>
        ) : (
          <>
            <p><span className="stat_number">{stats.applications}</span> 📄 Applications</p>
            <p><span className="stat_number">{stats.interviews}</span> 🎤 Interviews</p>
            <p><span className="stat_number">{stats.applied}</span> ⏳ Applied</p>
          </>
        )}
      </div>

      <div className="upcoming_events">
        <p className="upcoming_title">Upcoming Events</p>
        <span>Resume Work shop March 29</span>
        <span>Microsoft Interview- March 30</span>
        <span>Lunch with Fiona April 1</span>
       
        {/* {loadingInterviews ? (
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
        )}*/}
      </div>
      
   



    </div>
  );
}

export default Dashboard;
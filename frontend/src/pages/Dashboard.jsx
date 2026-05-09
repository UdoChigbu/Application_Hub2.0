import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { User } from "lucide-react";


function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const first_name = localStorage.getItem("first_name");
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");
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

  const hasEventsThisMonth = events.some(event => event.date?.slice(0, 7) === currentMonth);


  useEffect(()=>{
    const fetchEvents = async ()=>{
      try {
        const response = await fetch (`${API_BASE_URL}/api/events/me`, {
          headers: {
          Authorization: `Bearer ${token}`
          }
        });

        if(response.ok){
          const userEvents = await response.json();
          setEvents(userEvents);
        }

      } catch (error) {
        
      }
    }
    fetchEvents();
  }, [token]);


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

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);


  useEffect(() => {
    fetchStats();
    fetchUpcomingEvents();
  }, []);

  const fetchStats = async () => {
    try {
      const appRes = await fetch(
        `${API_BASE_URL}/api/applications/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const fetchUpcomingEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const firstThreeEvents = data
      .filter((event) => event.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
      setUpcomingEvents(firstThreeEvents);

    } catch (error) {
      console.error("Error fetching upcoming events:", error);
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

  const handleLogout = ()=>{
    navigate("/Login");
    localStorage.removeItem("token");
  };

  const [showLogoutButton, setShowLogoutButton] = useState(false);

  return (
    <div className="background">
      <div className="page_content">
      <h1>Application Hub</h1>
      <p className="welcome_message">Welcome, {first_name}👋</p>

        <div className="profile_container" onClick={()=>setShowLogoutButton(!showLogoutButton)}>
          <User size = {35}/>
          {showLogoutButton&&(
            <div className = "logout_dropdown">
              <button className = "logout_button" onClick={handleLogout}>Sign out?</button>
            </div>
        )}
        </div>

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
          onClick={() => navigate("/Upgrade_resume")}
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

      {hasEventsThisMonth === false &&(<p className="calendar_hint"> No events this month. Click a day to add one!</p>)}
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
        {upcomingEvents.map((event)=>(
          <div key={event.id}>
              <span>{event.title}-{formatDate(event.date)}</span>
          </div>
        ))}
        
      </div>
      
   


      </div>
    </div>
  );
}

export default Dashboard;

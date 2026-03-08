import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "../styles/Dashboard.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


function Dashboard(){
const first_name = localStorage.getItem("first_name");
const [events, setEvents] = useState([]);
const navigate = useNavigate();

const handleDateClick = (info) => {
    const title = prompt("Enter event name:");

    if (title) {
      setEvents([
        ...events,
        { title, date: info.dateStr }
      ]);
    }
  };






return(
    <div className="dashboard_background">
        <h1>Application Hub</h1>
        <p className="welcome_message">Welcome, {first_name}👋</p>
        <div className="quick_actions_box">
            <button type="button" className="quick_actions_btn"  onClick={() => navigate("/Add_application")}>Add new application.</button>
            <button type="submit" className="quick_actions_btn">Add new interview.</button>
            <button type="submit" className="quick_actions_btn">Add new event.</button>
        </div>
       
        <Link to="/applications" className="app_card_link">
            <div className="application_card">
                <h2>📄Your applications</h2>
                <p> View and manage your applications</p>
             </div>
        </Link>
        <Link to="/upcoming_interviews" className="upcoming_interviews_link">
            <div className="interviews_card">
                <h2>💻Your interviews</h2>
                <p> View and manage your interviews</p>
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
            <p>(amount)📄Applications</p>
            <p>(amount)🎤Interviews</p>
            <p>(amount)⏳Pending</p>
        </div>
       
        <div className="upcoming_interviews">
            <p>Upcoming Events</p>
            <p>(list interviews here)</p>
        </div>


    </div>
)




}
export default Dashboard;
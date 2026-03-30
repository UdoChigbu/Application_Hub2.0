import "../styles/Manage_events.css";

import { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";

function Manage_events(){

    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const userId = useState(() => Number(localStorage.getItem("userId")));
    useEffect(()=>{
        const fetchEvents = async ()=>{
            try{
                const response = await fetch(`http://localhost:8081/api/events/get_events/${userId}`);
                const data = await response.json();
                setEvents(data);
            }
            catch(error){
                console.error("Error fetching events:", error);
            }
        }
        fetchEvents();
    },[userId]);






    return(
        <div className="background">
            <h1>Manage Events</h1>
           
                <div className="event_card_container">
                    <Link className="event_card_link" to="/edit_delete_kebab">

                        {events.map((event) =>(
                            <div className="event_card" key={event.id}>
                                <h3>{event.title}</h3>
                                <p>{event.date}</p>
                            </div>
                        ))}
                       

                    </Link>
                    
                </div>
            
           
        
        </div>
    );
}
export default Manage_events;
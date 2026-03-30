import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../styles/Add_event.css";

function Add_event(){
   const { date } = useParams();
   const navigate = useNavigate();
   const [userId] = useState(() => Number(localStorage.getItem("userId")));
   const [errorMessage, setErrorMessage] = useState("");
  

   const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    location:"",
    notes: "",
   
   });
    
   const handleChange = (e) =>{
      setFormData({...formData, [e.target.name]: e.target.value});
   };

   const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!formData.title){
            setErrorMessage("Please fill in the title.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8081/api/events/create_event`,{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    date,
                    userId
                })
            });

            if(response.ok){
                //save new event
                const newEvent = {
                    ...formData,
                    date: date,
                    userId: userId
                };

                //make a list of all events
                const allEvents = JSON.parse(localStorage.getItem("events")) || [];

                //update the events
                const updatedEvents = [
                    ...allEvents,
                    newEvent
                ];


                // turns list into string
                localStorage.setItem("events", JSON.stringify(updatedEvents));
                
                const hasSeenEventSuccessPage = (localStorage.getItem("seenEventSuccessPage"));
                if(!hasSeenEventSuccessPage){
                    localStorage.setItem("seenEventSuccessPage", "true");
                    localStorage.setItem("formType", "event")
                    navigate("/Succesfully_submitted");
                }
                else{
                    navigate("/Dashboard");
                }
                
            }

        } catch (error) {
            console.log(error);
        }
      

   }
   

    return(
        
        <div className="Add_event_background">
            <h1>Add Event</h1>
            <div className="modal">
                    <p className="date_title">{date}</p>
                    {errorMessage &&<p className="error_message">{errorMessage}</p>}
                    
                    <form id="event_form" className="event_form" onSubmit={handleSubmit}>
                        <label htmlFor ="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            id="title"
                            className="text_box"
                            value={formData.title}
                            onChange={handleChange}
                            />
                        <label htmlFor ="location">Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            id="location"
                            className="text_box"
                            value={formData.location}
                            onChange={handleChange}
                            />
                        <label htmlFor="startTime">Start time</label>
                        <input
                            type="time"
                            name="startTime"
                            placeholder="Enter the start time"
                            id="startTime"
                            className="text_box"
                            value={formData.startTime}
                            onChange={handleChange}
                            />
                        <label htmlFor="">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            placeholder="Add any notes about the event..."
                            className="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        ></textarea>

                        <div className="save_cancel_container">
                            <button type="button" className="save_cancel_buttons" onClick={()=>navigate("/Dashboard")}>Cancel</button>
                            <button type="submit" className="save_cancel_buttons">Save Application</button>
                        </div>
                    </form>
                   

             
            </div>
        </div>

    );
}
export default Add_event;
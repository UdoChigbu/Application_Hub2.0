import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "../styles/Add_application.css";

function Add_application(){

const navigate=useNavigate();
const userId = localStorage.getItem("userId");
const [formData, setFormData] = useState({
    company: "",
    jobTitle: "",
    location: "",
    dateApplied: "",
    deadline:"",
    notes:"",
    status:"",
    
});


const handleChange = (e)=>{
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
}

const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
        const response = await fetch("http://localhost:8081/api/applications",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...formData,
                userId: Number(userId)
            })
        });

        const data= await response.json();
        if(response.ok){
            navigate("/Succesfully_submitted")
        }
        else{
            console.log(data.message);
        }

    }
    catch(error){
        console.error("Error:", error);
    }
};














return(
    <div className="Add_application_background">
        <h1>Create New Application</h1>
        <div className="job_info_section">
            <p className="section_header">Job information</p>
            
            <form id="application_form" onSubmit={handleSubmit}>
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
                        <label htmlFor="location">Location (City, State)</label>
                            <input
                            type="text"
                            name="location"
                            placeholder="e.g. Atlanta, GA"
                            id="location"
                            className="text_box"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="application_boxes">
                        <label htmlFor="date_applied">Date applied</label>
                            <input
                            type="date"
                            name="dateApplied"
                            id="date_applied"
                            className="text_box"
                            value={formData.dateApplied}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="application_boxes">
                        <label htmlFor="deadline">Application deadline</label>
                            <input
                            type="date"
                            name="deadline"
                            id="deadline"
                            className="text_box"
                            value={formData.deadline}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="application_boxes">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                        id="notes"
                        name="notes"
                        placeholder="Add any notes about the application..."
                        className="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="application_boxes">
                        <label htmlFor="status" className="status_label">Status</label>
                        <select
                            name="status"
                            className="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="">Select status</option>
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Offer">Offer</option>
                        </select>
                    </div>

                    <div className="save_cancel_box">
                        <button type="button" className="application_page_buttons" onClick={()=>navigate("/Dashboard")}>Cancel</button>
                        <button type="submit" className="application_page_buttons">Save Application</button>
                    </div>

            </form>
            

        </div>












    </div>

    
)

}
export default Add_application;
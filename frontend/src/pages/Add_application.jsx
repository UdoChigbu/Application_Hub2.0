import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "../styles/Add_application.css";

function Add_application(){

const navigate=useNavigate();
const [formData, setData] = useState({
    company: "",
    jobTitle: "",
    location: "",
    dateApplied: "",
    deadline:"",
    notes:"",

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
            body: JSON.stringify(formData)
        });

        const data = await response.json();

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
                            value={setData.company}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="application_boxes">
                        <label htmlFor="job_title">Job title</label>
                            <input
                            type="text"
                            name="jobTitle"
                            placeholder="Enter job title"
                            id="job title"
                            className="text_box"
                            value={setData.jobTitle}
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
                            value={setData.location}
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
                            value={setData.dateApplied}
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
                            value={setData.deadline}
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
                        value={setData.notes}
                        onChange={handleChange}
                        ></textarea>
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
import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import "../styles/Add_application.css";
import { useParams } from "react-router-dom";

function Add_application(){

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const navigate=useNavigate();

const token = localStorage.getItem("token");
localStorage.setItem("formType", "application");
const { id } = useParams();

useEffect(()=>{
    const editApplication = async ()=> {
        try{
            if(!id) return;
            const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.ok){
                const data = await response.json();
                setFormData(data);
            }
            
        }
        catch(error){
            console.log(error);
        }
    };
editApplication();
}, [id]);


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
};

const handleSubmit = async (e)=>{
    e.preventDefault();
    const method = id? "PUT" : "POST";
    const url = id? `${API_BASE_URL}/api/applications/${id}` :`${API_BASE_URL}/api/applications`;
    try{
        const response = await fetch(url,{
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({...formData
            })
        });

     
        if(response.ok){
                const data= await response.json();
                const hasSeenApplicationSuccessPage = (localStorage.getItem("seenApplicationSuccessPage"));
                if(!hasSeenApplicationSuccessPage){
                    localStorage.setItem("seenApplicationSuccessPage", "true");
                    localStorage.setItem("formType", "Application")
                    navigate("/Succesfully_submitted");
                }
                else{
                    navigate("/Manage_applications");
                }
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
    <div className="background">
        <div className="page_content">
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
                            <option value="Offered">Offered</option>
                        </select>
                    </div>

                    <div className="save_cancel_box">
                        <button type="button" className="application_page_buttons" onClick={()=>navigate("/Dashboard")}>Cancel</button>
                        <button type="submit" className="application_page_buttons">Save Application</button>
                    </div>

            </form>
            

        </div>











        </div>
    </div>

    
)

}
export default Add_application;

import "../styles/Manage_applications.css";
import { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";



function Manage_applications(){
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [applications, setApplications] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const[openMenuId, setOpenMenuId] = useState(null);
    const [showDeleteModule, setShowDeleteModule] = useState(false);
    const[deletedAppId, setDeletedAppId] = useState(null);
    const [noApplicationsMessage, setNoApplicationsMessage] = useState("");

    const filteredApplications = applications.filter((app)=>{
        if(statusFilter==="All")return true;
        return app.status===statusFilter;
    });

    useEffect(()=>{
        const fetchApplications = async ()=>{
            try{
                const response = await fetch(`${API_BASE_URL}/api/applications/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if(!response.ok){
                    setNoApplicationsMessage("No applications found.");
                    setApplications([]);
                    return;
                }
                const data = await response.json();
                setApplications(Array.isArray(data) ? data :[]);

            }
            catch(error){
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    },[token]);


    const handleDelete = async ()=>{
        try {
            const response =await fetch(`${API_BASE_URL}/api/applications/${deletedAppId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response.ok){
            setApplications(prev=>prev.filter(app=>app.id!==deletedAppId));
            setShowDeleteModule(false);
            return;
        }
    

        
        } catch (error) {
            console.log(error);
        }
       

    };


    return(
        <div className="background">
            <div className="page_content">
            <h1>Manage applications</h1>
            <div className="quick_actions_box">
                <button type="button" className="quick_actions_btn"  onClick={() => navigate("/Add_application")}>Add new application.</button>
            </div>

            <div className="filter_box">
                <h2>Filter by status:</h2>
                    <select
                        name="filter_status_dropdown"
                        className="filter_status_dropdown"
                        onChange = {(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                    </select>
            </div>

            <div className="table_box_background">
                <div className="table_box">
                    <table className="applications_table">

                         <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Company</th>
                                    <th>Job Title</th>
                                    <th>Location</th>
                                    <th>Date Applied</th>
                                    <th>Deadline</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>

                        <tbody>
                            {filteredApplications.length===0 ?(
                                <tr>
                                    <td colSpan="8" className="no_applications_message">No applications found.</td>
                                </tr>
                            ):
                            (filteredApplications.map((app)=>(
                                <tr key={app.id}>
                                    
                                    <td>
                                        <span className={`status ${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    
                                    <td>{app.company}</td>
                                    <td>{app.jobTitle}</td>
                                    <td>{app.location}</td>
                                    <td>{app.dateApplied}</td>
                                    <td>{app.deadline}</td>
                                    <td>{app.notes}</td>
                                    <td> 
                                        <button type="button" className="kebab" onClick={()=> setOpenMenuId(openMenuId === app.id ? null : app.id)}>
                                        ⋮
                                        </button>
                                        {openMenuId === app.id &&(
                                            <div className="kebab_dropdown">
                                                <button className="edit" type="button" onClick={()=>navigate(`/Edit_application/${app.id}`)}>Edit</button>

                                                <button className="delete" type="button" onClick={()=> 
                                                {setShowDeleteModule(true);
                                                setDeletedAppId(app.id);
                                                }}>Delete</button>
                                            </div>
                                        )}
                                    </td>
                                
                                </tr>
                            )))}
                        </tbody>
                    </table>

                       {showDeleteModule &&(
                        <div className="delete_modal">
                            <div className="delete_modal_content">
                                <span>Are you sure you want to delete this application?</span>
                                <div className="delete_modal_actions">
                                    <button type="button" className="delete_modal_buttons" 
                                    onClick={()=>{
                                        handleDelete();
                                    }}>Yes</button>

                                    <button type="button" className="delete_modal_buttons" onClick={()=> setShowDeleteModule(false)}>No</button>
                                </div>
                               
                            </div>
                        </div>
                    )}     

                </div>
            </div>
             
            
                    
            </div>        

        </div>

    )
}export default Manage_applications;

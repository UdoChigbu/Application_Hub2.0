import "../styles/Manage_applications.css";
import { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";



function Manage_applications(){
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [applications, setApplications] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const[openMenuId, setOpenMenuId] = useState(null);
    const [showDeleteModule, setShowDeleteModule] = useState(false);
    const[deletedAppId, setDeletedAppId] = useState(null);

    const filteredApplications = applications.filter((app)=>{
        if(statusFilter==="All")return true;
        return app.status===statusFilter;
    });

    useEffect(()=>{
        const fetchApplications = async ()=>{
            try{
                const response = await fetch(`http://localhost:8081/api/applications/user/${userId}`);
                const data = await response.json();
                setApplications(data);
            }
            catch(error){
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    },[userId]);


    const handleDelete = async ()=>{
        try {
             await fetch(`http://localhost:8081/api/applications/${deletedAppId}`, {
            method: "DELETE"
        });

        setApplications(prev=>prev.filter(app=>app.id!==deletedAppId));
        setShowDeleteModule(false);

        } catch (error) {
            console.log(error);
        }
       

    };


    return(
        <div className="Manage_applications_background">
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
                            {filteredApplications.map((app)=>(
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
                                                {setShowDeleteModule(true)
                                                setDeletedAppId(app.id);
                                                }}>Delete</button>
                                            </div>
                                        )}
                                    </td>
                                
                                </tr>
                            ))}
                        </tbody>
                    </table>

                       {showDeleteModule &&(
                        <div className="delete_modal">
                            <div className="delete_modal_content">
                                <p>Are you sure you want to delete this application?</p>
                                <div className="delete_modal_buttons_box">
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

    )
}export default Manage_applications;
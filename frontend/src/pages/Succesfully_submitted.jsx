import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Succesfully_submitted.css";


function Succesfully_submitted(){
    const navigate = useNavigate();
    const formType = localStorage.getItem("formType");

    return(
        <div className="Succesfully_submitted_background">
            <h1>Yay! You succesfully created an {formType}!🎊</h1>
            <button type="button" className="dashboard_button" onClick={()=>navigate("/Dashboard")}>Return to Dashboard</button>
        </div>
        
    )

}
export default Succesfully_submitted;
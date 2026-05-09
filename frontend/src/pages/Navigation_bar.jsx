import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../styles/Navigation_bar.css";
import { useEffect, useState } from "react";
function Navigation_bar(){
    const navigate = useNavigate();
        const location = useLocation();
         const onDashboard = location.pathname
        .toLowerCase()
        .startsWith("/dashboard");


    return(
        <div className="background">
                <div className="blob blob1" />
                <div className="blob blob2" />
                <div className="blob blob3" />
                <div className="blob blob4" />
                <div className="blob blob5" />
                <div className="blob blob6" />
           
            {!onDashboard&&(
                <button type="button" className="home_button" onClick={()=> navigate("/Dashboard")}>
                    <FaHome size={35} />
                </button>
            )}
            
            <div className="page_content">
                <Outlet />
            </div>
        </div>
    ); 
}
export default  Navigation_bar;
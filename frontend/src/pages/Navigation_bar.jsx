import { Outlet, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../styles/Navigation_bar.css";
function Navigation_bar(){
    const navigate = useNavigate();

    return(
        <div className="background">
                <div className="blob blob1" />
                <div className="blob blob2" />
                <div className="blob blob3" />
                <div className="blob blob4" />
                <div className="blob blob5" />
                <div className="blob blob6" />
           
            
            <button type="button" className="home_button" onClick={()=> navigate("/dashboard")}>
                <FaHome size={30} />
            </button>

            <Outlet/>
        </div>
    ); 
}
export default  Navigation_bar;
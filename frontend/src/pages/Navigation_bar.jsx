import { Outlet, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../styles/Navigation_bar.css";
function Navigation_bar(){
    const navigate = useNavigate();

    return(
        <div>
            <button type="button" className="home_button" onClick={()=> navigate("/dashboard")}>
                <FaHome size={30} />
            </button>

            <Outlet/>
        </div>
    ); 
}
export default  Navigation_bar;
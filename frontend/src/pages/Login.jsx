import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login(){
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const[formData, setFormData]=useState({
        email:"",
        password:""
    });

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!formData.email||!formData.password)
            {
            setErrorMessage("Please fill in all fields.");
            return;
            }

        try{
            const response = await fetch(
                "http://localhost:8081/api/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();
            if(response.ok){
                navigate("/dashboard")
            }
            else{
                setErrorMessage(data.message);
            }
        }
        catch(err){
            console.error(err);
            setErrorMessage("Something went wrong. Please try again.");
        }
    }

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }





return(
    <div className="background">
        
        <div className="login_module">
                <h1>Login</h1>
                 <button
                    className="close_login_btn"
                    onClick={() => navigate("/Signup")}
                >
                    &times;
                </button>
                {errorMessage && <p className="error_message">{errorMessage}</p>}
                <form id="login_form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                    <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    id="email"
                    className="text_box"
                    value={formData.email}
                    onChange={handleChange}
                />

                <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    id="password"
                    className="text_box"
                    value={formData.password}
                    onChange={handleChange}
                    />
                    <button type="submit" className="login_btn">Submit</button>
                
                </form>
                
        </div>

      

    </div>
   


);
























}
export default Login;
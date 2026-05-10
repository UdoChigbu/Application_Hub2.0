import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";
import resumeGirl from "../assets/images/resume_girl.png";


function Signup() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

  //validate fields
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if(formData.password.length < 6 || formData.confirm_password.length < 6){
        setErrorMessage("Password must be at least 6 characters long.");
        return;
    }
   

     try {
        const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
        // Success
        navigate("/login"); // Redirect after signup
        } else {
       
        setErrorMessage(data.message || "Signup failed");
        }
        } catch (err) {
            console.error(err);
            console.log(err);
            setErrorMessage("Something went wrong. Please try again.");
        }

    };

  return (
<div className="sign_up_background">
    <h1>Application Hub</h1>
    <div className="signup_modal">
      <div className="signup_modal_content">
       

        {/* Left side */}
        <div className="left_side">
         
          <h1>Create an account</h1>
          {errorMessage && <p className="error_message">{errorMessage}</p>}
          <form id="signup_form" onSubmit={handleSubmit}>
            <label htmlFor="first_name">First name</label>
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              id="first_name"
              className="text_box"
              value={formData.first_name}
              onChange={handleChange}
            />

            <label htmlFor="last_name">Last name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              id="last_name"
              className="text_box"
              value={formData.last_name}
              onChange={handleChange}
            />

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

            <label htmlFor="confirm_password">Confirm password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
              id="confirm_password"
              className="text_box"
              value={formData.confirm_password}
              onChange={handleChange}
            />
            <div className="signup_actions">
    
              <button type="submit" className="signup_btn">
                Sign up
              </button>
              
               <Link to="/login" className="login_link">
                Have an account? Sign in here
              </Link>

            </div>
            
           
          </form>

          
        </div>
        {/* Left side */}

        {/* Right side */}
        <div className="right_side">
          <img
            src={resumeGirl}
            alt="girl on computer"
            className="on-computer"
          />
        </div>
        {/* Right side */}
      </div>
    </div>
</div>
  );
}

export default Signup;

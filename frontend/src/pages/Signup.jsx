import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";
import resumeGirl from "../assets/images/resume_girl.png";


function Signup() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

  //validate fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if(formData.password.length < 6 || formData.confirmPassword.length < 6){
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
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              id="firstName"
              className="text_box"
              value={formData.firstName}
              onChange={handleChange}
            />

            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              id="lastName"
              className="text_box"
              value={formData.lastName}
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

            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              id="confirmPassword"
              className="text_box"
              value={formData.confirmPassword}
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

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";


function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Simple validation example
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
    setErrorMessage("");

     try {
        const response = await fetch("http://localhost:8081/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
        // Success
        navigate("/welcome"); // Redirect after signup
        } else {
        // Backend returned an error
        setErrorMessage(data.message || "Signup failed");
        }
        } catch (err) {
            console.error(err);
            setErrorMessage("Something went wrong. Please try again.");
        }

    };

  return (
<div className="background">
    <div className="signup_modal">
      <div className="signup_modal_content">
       

        {/* Left side */}
        <div className="left_side">
          {errorMessage && <p className="error_message">{errorMessage}</p>}
          <h1>Create an account</h1>

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

            <button type="submit" className="signup_btn">
              Sign up
            </button>
          </form>

          <Link to="/login" className="login_link">
            Have an account? Sign in here
          </Link>
        </div>
        {/* Left side */}

        {/* Right side */}
        <div className="right_side">
          <img
            src="src/assets/images/resume_girl.png"
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
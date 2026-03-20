import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "../styles/Forgot_password.css";

function Forgot_password(){
    const navigate = useNavigate();
    const [instructions, setInstructions]=useState("Enter your email and you will receive a code to reset your password.");
    const [steps, setSteps]= useState(1);
    const[emailForm, setEmailForm]=useState({
        email: ""
    });
    const[codeForm, setCodeForm]=useState({
        code: ""
    });
    const[newPasswordForm, setNewPasswordForm]=useState({
        newPassword:"",
        confirmNewPassword:""
    });

    const handleSendEmail = async (e) => {
            e.preventDefault();
                try{
                const response = await fetch("http://localhost:8081/api/forgot_password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emailForm),
                });
                
                if(response.ok){
                setSteps(2);
                setInstructions("Type in the code you received in your email to reset your password.");
                //send user an email with reset code and then once they submit the code check in the backend if its correct
                /*if (email sent){
                check if the users input matches the code in the backend;
                }
                else{
                email does not have an account    
                    }*/
                   
                }
                    
                }
                catch(error){
                    console.log(error);
                }
    }
        
    const handleSendCode = async(e) => {
        e.preventDefault();
        if(steps===2){
            setSteps(3);
            setInstructions("Type in your new Passoword");
        }
    }   
    
    const handleSendNewPassword = async(e) =>{
        e.preventDefault();
        //if new password meets all requirements and is saved redirect to success

    }





    const handleEmail = (e) =>{
        setEmailForm({
            ...emailForm,
            [e.target.name]: e.target.value
        });
    }

    const handleCode = (e) =>{
        setCodeForm({
            ...codeForm,
            [e.target.name]: e.target.value
        });
    }

    const handleNewPassword = (e)=>{
        setNewPasswordForm({
            ...newPasswordForm,
            [e.target.name]: e.target.value
        });
    }


    return (
    <div className="forgot_password_background">
        <div className="forgot_password_module">
              <button
                    className="close_login_btn"
                    onClick={() => navigate(-1)}
                >
                    &times;
                </button>
            <h1>Forgot password</h1>
            <p>{instructions}</p>

            {steps === 1 &&(
            <form id="emailForm" onSubmit={handleSendEmail}>
                <>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className="text_box"
                        onChange={handleEmail}
                        value={emailForm.email}
                    />
                </>
                
                <button type="submit" className="submit_btn" >Submit</button>
                </form>
             )}   

           {steps === 2 &&(
              <form id="codeForm" onSubmit={handleSendCode}>
                
                <>
                <label htmlFor="code">Code</label>
                    <input
                        type="text"
                        name="code"
                        id="code"
                        placeholder="Enter your code"
                        className="text_box"
                        onChange={handleCode}
                        value={codeForm.code}
                    />
                </>      
              <button type="submit" className="submit_btn" >Submit</button>
              </form>
            )}

            {steps === 3 &&(
             <form id="newPasswordForm" onSubmit={handleSendNewPassword}>
                    <>
                    <label htmlFor="newPassword">New password</label>
                        <input
                            type="text"
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter your new password"
                            className="text_box"
                            onChange={handleNewPassword}
                            value={newPasswordForm.newPassword}
                        />
                     <label htmlFor="confirmNewPassword">Confirm new password</label>
                        <input
                            type="text"
                            name="confirmNewPassword"
                            id="confirmNewPassword"
                            placeholder="Re-enter your new password"
                            className="text_box"
                            onChange={handleNewPassword}
                            value={newPasswordForm.newPassword}
                        />


                    </>
                    <button type="submit" className="submit_btn" >Submit</button>
                </form>   
              )}
              
            
               
                 
            

        </div>
    </div>
);

}
export default Forgot_password;
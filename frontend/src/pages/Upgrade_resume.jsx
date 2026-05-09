import "../styles/Upgrade_resume.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";

function Upgrade_resume() {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [steps, setSteps] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [jobPosition, setJobPosition] = useState("");
    const token = localStorage.getItem("token");
    const [upgradedResume, setUpgradedResume]=useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const abortRef = useRef(null);
    const timeoutRef = useRef(null);

    //for when user cancels request to enhance resume
    useEffect(()=>{
        return ()=>{
            if(abortRef.current){
                abortRef.current.abort();
            }
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current);
            }

        };


    },[])
    
    const handleUpload = async (file) =>{
        if (abortRef.current) {
            abortRef.current.abort();
        }

        abortRef.current = new AbortController();
          
        try{
            setErrorMessage("");
            const formData = new FormData();
            formData.append("jobPosition", jobPosition);
            formData.append("file", file);
            setIsProcessing(true);
            setSteps(null);

            const response = await fetch(`${API_BASE_URL}/api/upgrade_resume/upload`, {
                method:"POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
                signal: abortRef.current.signal
            });

            if(response.ok){
                const data = await response.json();
                const fileId = data.fileId;
              
                
                const checkStatus = async ()=>{
                    try {
                        const getUrlResponse = await fetch(`${API_BASE_URL}/api/upgrade_resume/${fileId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                },
                                signal: abortRef.current.signal
                            }
                        );
                        if(getUrlResponse.ok){
                        const getUrlResponseData = await getUrlResponse.json();
                            
                            if(getUrlResponseData.status==="COMPLETED"){
                                setErrorMessage("");
                                setIsProcessing(false);
                                setUpgradedResume(getUrlResponseData.url); 
                                setSteps(3);
                                if(timeoutRef.current){
                                    clearTimeout(timeoutRef.current);

                                }
                                return;
                            }
                            else{
                                if (timeoutRef.current) {
                                    clearTimeout(timeoutRef.current);
                                }
                                timeoutRef.current = setTimeout(checkStatus, 2000);
                            }
                        }
                        
                        else {
                            if (timeoutRef.current) {
                                clearTimeout(timeoutRef.current);
                            }
                            timeoutRef.current = setTimeout(checkStatus, 5000);
                        }
                      
                    } catch (error) {
                        if(error.name !== "AbortError"){
                            setErrorMessage("There was an issue uploading your file. Please try again later.");
                            console.error("error getting upgraded resume link: ", error);
                            setIsProcessing(false)
                        }
                        
                    }  
                };
                checkStatus();
            }
            if (!response.ok) {
                setErrorMessage("There was an issue uploading your file. Please try again later.");
                throw new Error("Upload failed");
            }
        }
        catch(error){
            if(error.name !== "AbortError"){
                setErrorMessage("There was an issue uploading your file. Please try again later.");
                console.error("error uploading file: ", error);
                setIsProcessing(false);
                
            }
        }
    };


    const handleFileChange = (e)=> {
        setErrorMessage("");
        const file = e.target.files[0];
        if(!file)return;

        if(!file.name.endsWith(".docx")){
            setErrorMessage("Only .docx files allowed");
            return;
        }
        
        handleUpload(file);
        console.log(file);
    };

    const handleJobPosition = (e)=>{
        setErrorMessage("");
        if(!jobPosition.trim())
        {
            setErrorMessage("Please enter the job position you are applying for.");
            return;
        }
        setSteps(2);
    };




  return (
    <div className="background">
      <div className="page_content">
        <h1>Upgrade your resume with AI</h1>
        <div className="modal">
            <div className="modal_content">
                 <button
                    className="close_login_btn"
                    onClick={() =>{
                    if(steps===1){
                        setErrorMessage("");
                        navigate("/Dashboard");
                    }
                    else{
                        setErrorMessage("");
                        setSteps(1);
                    }
                }}
                >
                    &times;
                </button>
                {errorMessage && (<p className="error_message">{errorMessage}</p>)}
                {steps ===1 &&(
                    <>
                        <h2>Upgrade Your Resume</h2>
                        <div className="job_position_content">
                            
                            <label htmlFor="jobPosition"> Enter the job position you are applying for.</label>
                            <input type="text"
                                name="jobPosition"
                                id="jobPosition"
                                className="text_box"
                                onChange={(e)=>setJobPosition(e.target.value)}
                                value={jobPosition} />
                            
                            <button type="button" className="upgrade_button" onClick={handleJobPosition}>Upgrade Now</button>
                        </div> 
                    </> 
                )}

                {steps===2 &&(
                     <>
                        <h2> Upload your resume here.</h2>
                        <div className="upload_content">
                               
                                <FaCloudUploadAlt className="cloud_icon" />
                                <input 
                                type="file"
                                ref={fileRef}
                                style={{ display: "none" }}
                                accept=".docx"
                                onChange={handleFileChange}
                                />
                                <button type="button" className="upload_button"  onClick={() => fileRef.current.click()}>Upload Resume</button>
                                <span>Only .docx files allowed</span>  
                           
                        </div>
                       
                     </>
                )}
                {steps === 3 &&(
                    <>
                    <h2>Your resume is ready!</h2>
                    <div className="resume_link_container">
                        <a className="resume_link" href={upgradedResume} download="upgraded_resume.docx">
                            <p className="resume_link_text">
                                Download Your Improved Resume
                            </p>
                        </a>
                    </div>
                    </>
                )}

                {isProcessing &&(
                    <>
                        <div className="processing_container">
                            <div className="spinner"></div>
                            <div className="processing_message">
                                <p>Processing...</p>
                                <p>This may take a few minutes.</p>
                            </div>
                            
                        </div>
                    </>
                   
                )}
                
              
            </div>
                
        </div>
      
      </div>
    </div>
  );
} 
export default Upgrade_resume;

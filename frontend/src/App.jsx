import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Add_application from "./pages/Add_application";
import Succesfully_submitted from "./pages/Succesfully_submitted";
import Manage_applications from "./pages/Manage_applications";
import Add_interview from "./pages/add_interview";
import Forgot_password from "./pages/Forgot_password";
import Navigation_bar from "./pages/Navigation_bar";
import Add_event from "./pages/Add_event";
import Manage_events from "./pages/Manage_events";

function App() {
  return (
    <BrowserRouter basename="/Application_Hub">
      <Routes>
       
          <Route path="/" element={<Splash />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Forgot_password" element={<Forgot_password/>} />
        <Route element={<Navigation_bar/>}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Add_application" element={<Add_application />} />
          <Route path="/Succesfully_submitted" element={<Succesfully_submitted />} />
          <Route path="/Manage_applications" element={<Manage_applications />} />
          <Route path="/Add_interview" element={<Add_interview />} />
          <Route path="/Add_event/:date" element={<Add_event/>} />
          <Route path="/Edit_application/:id" element={<Add_application />} />
          <Route path="/Manage_events" element={<Manage_events />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
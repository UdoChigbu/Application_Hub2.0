import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Add_application from "./pages/Add_application";
import Succesfully_submitted from "./pages/Succesfully_submitted";
import Manage_applications from "./pages/Manage_applications";
import Add_interview from "./pages/add_interview";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Add_application" element={<Add_application />} />
        <Route path="/Succesfully_submitted" element={<Succesfully_submitted />} />
        <Route path="/Manage_applications" element={<Manage_applications />} />
        <Route path="/Add_interview" element={<Add_interview />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
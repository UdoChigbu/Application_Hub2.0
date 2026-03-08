import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from"./pages/Dashboard";
import Add_application from "./pages/Add_application";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
         <Route path="/Dashboard" element={<Dashboard />} />
         <Route path="/Add_application" element={<Add_application />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
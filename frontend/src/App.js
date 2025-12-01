import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Login from "./loginpage/Login";
import SalesLandingPage from "./SalesLandingPage";
import MultiRoleRegistration from "./pages/MultiRoleRegistration";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Landing Page */}
        <Route path="/" element={<SalesLandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* Registration Page */}
        <Route path="/register" element={<MultiRoleRegistration />} />
        
      </Routes>
    </Router>
  );
}

export default App;

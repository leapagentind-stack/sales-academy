import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import SalesLandingPage from "./SalesLandingPage";
import Login from "./loginpage/Login";
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SalesLandingPage from "./SalesLandingPage";
import MultiRoleRegistration from "./pages/MultiRoleRegistration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SalesLandingPage />} />
        
        <Route path="/login" element={<Login />} />
        {/* Landing Page */}
        <Route path="/" element={<SalesLandingPage />} />

        {/* Registration Page */}
        <Route path="/register" element={<MultiRoleRegistration />} />
        
      </Routes>
    </Router>
  );
}

export default App;

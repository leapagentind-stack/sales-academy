import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import SalesLandingPage from "./SalesLandingPage";
import Login from "./loginpage/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SalesLandingPage />} />
        
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

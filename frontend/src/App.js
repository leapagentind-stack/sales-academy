import React from "react";
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SalesLandingPage from "./SalesLandingPage";
import MultiRoleRegistration from "./pages/MultiRoleRegistration";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<SalesLandingPage />} />

        {/* Registration Page */}
        <Route path="/register" element={<MultiRoleRegistration />} />
        
      </Routes>
    </Router>
  );
}

export default App;

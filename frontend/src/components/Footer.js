import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Academy Info */}
        <div className="footer-section">
          <h4>Academy</h4>
          <p>Upgrade your skills with industry-ready courses.</p>
        </div>

        {/* Explore Section */}
        <div className="footer-section">
          <h4>Explore</h4>
          <span onClick={() => navigate("/studenthomescreen")}>Home</span>
          
          <span onClick={() => handleScroll("recommended")}>Recommended</span>
          <span onClick={() => handleScroll("popular")}>Popular Courses</span>
          <span onClick={() => handleScroll("new")}>New Courses</span>
          <span onClick={() => handleScroll("categories")}>Categories</span>
        </div>

        {/* Categories Section */}
        <div className="footer-section">
          <h4>Categories</h4>
          <span onClick={() => navigate("/category/sales")}>Sales</span>
          <span onClick={() => navigate("/category/soft-skills")}>Soft Skills</span>
          <span onClick={() => navigate("/category/communication")}>Communication</span>
          <span onClick={() => navigate("/category/crm-tools")}>CRM Tools</span>
          <span onClick={() => navigate("/category/placement-training")}>Placement Training</span>
          <span onClick={() => navigate("/category/digital-online-sales")}>Digital Online Sales</span>
          <span onClick={() => navigate("/category/zoho-crm-essentials")}>Zoho CRM Essentials</span>
          <span onClick={() => navigate("/category/customer-data-management")}>Customer Data Management</span>
        </div>

        {/* Support Section */}
        <div className="footer-section">
          <h4>Support</h4>
          <span onClick={() => alert("Redirect to Help Center")}>Help Center</span>
          <span onClick={() => alert("Redirect to Contact Us")}>Contact Us</span>
          <span onClick={() => alert("Redirect to Privacy Policy")}>Privacy Policy</span>
          <span onClick={() => alert("Redirect to Terms & Conditions")}>Terms & Conditions</span>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Sales Academy. All rights reserved.
      </div>
    </footer>
  );
}

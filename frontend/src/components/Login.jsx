import "../styles/login.css";
import { studentAPI, teacherAPI } from "../services/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) return message.warning("Please select a role");
    
    setLoading(true);
    try {
      let response;
      if (form.role === "student") {
        response = await studentAPI.login({ email: form.email, password: form.password });
      } else {
        response = await teacherAPI.login({ email: form.email, password: form.password });
      }

      if (response.data && response.data.success) {
        const { token, data } = response.data;

        // These are the items Sidebar will delete on Logout
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));

        message.success(`Welcome back, ${data.firstName}!`);

        if (form.role === "student") {
          navigate("/studenthomescreen");
        } else {
          navigate("/dashboard/home");
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Login Failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '20px' }}>Login</h2>
        
        <input 
          type="email" 
          name="email" 
          placeholder="Enter Email" 
          required 
          onChange={handleChange} 
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Enter Password" 
          required 
          onChange={handleChange} 
        />
        
        <select name="role" required onChange={handleChange} value={form.role}>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
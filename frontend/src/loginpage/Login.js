import "../styles/login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { studentAPI, teacherAPI } from "../services/api"; // ✅ correct imports

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.role) {
      alert("Please select a role");
      return;
    }

    try {
      let response;

      // Call API based on selected role
      if (form.role === "student") {
        response = await studentAPI.login({
          email: form.email,
          password: form.password,
        });
      } else if (form.role === "teacher") {
        response = await teacherAPI.login({
          email: form.email,
          password: form.password,
        });
      }

      // Save token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful!");

      // Navigate based on role
      if (form.role === "student") navigate("/student-dashboard");
      else navigate("/teacher-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

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

        <select name="role" required onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

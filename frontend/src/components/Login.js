import "../styles/login.css";
import { studentAPI, teacherAPI } from "../services/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Login Request Payload:", form);

      let response;
      if (form.role === "student") {
        response = await studentAPI.login(form);
      } else if (form.role === "teacher") {
        response = await teacherAPI.login(form);
      } else {
        alert("Please select a role");
        return;
      }

      console.log("Login Response:", response.data);

      if (response.data && response.data.success) {
        const user = response.data.data;

        // Save user info in localStorage
        localStorage.setItem(
  "user",
  JSON.stringify({
    id: user.id,   // <-- ADD THIS
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: form.role,
  })
);

        localStorage.setItem("token", response.data.token);

        alert("Login Successful");

        // Redirect
        if (form.role === "student") {
          navigate("/studenthomescreen");
        } else if (form.role === "teacher") {
          navigate("/teacher-home");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.response || error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input type="email" name="email" placeholder="Enter Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Enter Password" required onChange={handleChange} />
        <select name="role" required onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

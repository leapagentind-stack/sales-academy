import "../styles/login.css";
import { loginUser } from "../services/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);

      alert("Login Successful");

      if (response.data.role === "student") {
        navigate("/student-dashboard");
      } else if (response.data.role === "teacher") {
        navigate("/teacher-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
  <form className="login-box" onSubmit={handleSubmit}>
    <h2>Login</h2>

    <input type="email" name="email" placeholder="Enter Email" required onChange={handleChange} />

    <input type="password" name="password" placeholder="Enter Password" required onChange={handleChange} />

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

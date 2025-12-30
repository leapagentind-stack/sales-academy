import React, { useEffect, useState } from "react";
import { studentAPI } from "../services/api";
import "../styles/Profile.css";

export default function Profile() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await studentAPI.getProfile();
        const data = res.data.data;

        setForm({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.updateProfile(form);
      setMsg("Profile updated successfully ✅");
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  return (
    
    <div className="profile-container">
      
      <h2>My Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />

        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />

        <input
          name="email"
          value={form.email}
          disabled
          placeholder="Email"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <button type="submit">Update Profile</button>

        {msg && <p className="success">{msg}</p>}
      </form>
    </div>
  );
}

import axios from "axios";

const API = "http://localhost:5000/api/auth"; // adjust if needed

export const loginUser = async (data) => {
  return await axios.post(`${API}/login`, data);
};

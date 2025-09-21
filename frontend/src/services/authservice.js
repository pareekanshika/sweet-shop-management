// services/authservice.js
import axios from "axios";
const API_URL = "http://localhost:5000/api/auth";

export const register = async (username, password, isAdmin) => {
  const res = await axios.post(`${API_URL}/register`, { username, password, isAdmin });
  return res.data;
};

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data;
};

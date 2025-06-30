import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Adjust if deployed

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach token to every request if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

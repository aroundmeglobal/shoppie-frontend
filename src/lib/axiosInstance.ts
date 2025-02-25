import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL =
  // process.env.NEXT_PUBLIC_API_URL || 
  "https://fastapi.aroundme.tech/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        Cookies.remove("authToken"); // Remove token on 401
        window.location.href = "/login"; // Redirect to login page
      } else if (status === 403) {
        console.warn("Access forbidden!");
        alert("You do not have permission to access this resource.");
      } else if (status === 500) {
        console.error("Server error! Try again later.");
      }
    } else {
      console.error("Network error! Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

export default api;

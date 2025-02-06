import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7255/api", // Base URL of backend
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Mock function to refresh token locally
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expirationTime");

    // Kiểm tra nếu không phải đang ở trang login và có token
    if (config.url !== "/signin" && token) {
      if (new Date().getTime() > expirationTime) {
        localStorage.clear();
        if (
          window.confirm("Your session has expired. Click OK to log in again.")
        ) {
          window.location.href = "/singin";
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

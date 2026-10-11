import axios from "axios";
import { BASE_URL } from "./apiPaths";


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // required for cookies/auth
});





// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        // Do NOT redirect or reload the page if the 401 was from login or register
        const requestUrl = error.config?.url || "";
        const isAuthRequest =
          requestUrl.includes("/api/auth/login") ||
          requestUrl.includes("/api/auth/register");

        if (!isAuthRequest) {
          // Stale / expired token: clear it so userContext doesn't loop
          localStorage.removeItem("token");

          // Only redirect if not already on the landing page
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
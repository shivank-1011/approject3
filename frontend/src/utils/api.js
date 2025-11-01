import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Callback to handle token expiry (will be set by AuthContext)
let onTokenExpiry = null;

export const setTokenExpiryHandler = (handler) => {
  onTokenExpiry = handler;
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect during login/register attempts
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                             error.config?.url?.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        localStorage.removeItem("token");
        
        // Call the token expiry handler if available
        if (onTokenExpiry) {
          onTokenExpiry();
        }
        
        // Redirect to login page
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
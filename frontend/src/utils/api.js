import axios from "axios";

// Prefer configured env var. Fallback to same-origin "/api" in production,
// and localhost during local development.
const isBrowser = typeof window !== "undefined";
const sameOriginApi = isBrowser
  ? `${window.location.origin}/api`
  : "http://localhost:3000/api";
const API_BASE_URL = import.meta.env.VITE_API_URL || sameOriginApi;

// Helpful during debugging; safe to keep as it only logs the base URL in the browser
console.log("API_BASE_URL:", API_BASE_URL);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let onTokenExpiry = null;

export const setTokenExpiryHandler = (handler) => {
  onTokenExpiry = handler;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthEndpoint =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register");

      if (!isAuthEndpoint) {
        localStorage.removeItem("token");

        if (onTokenExpiry) {
          onTokenExpiry();
        }

        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

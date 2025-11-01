import React, { createContext, useState, useContext, useEffect } from "react";
import api, { setTokenExpiryHandler } from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Set up token expiry handler on mount
  useEffect(() => {
    setTokenExpiryHandler(() => {
      logout();
    });
  }, []);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (response.data.success && response.data.data.user) {
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Token is invalid, clear it
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        localStorage.setItem("token", token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: userData };
      }
      
      return { success: false, message: "Login failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        localStorage.setItem("token", token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: userData };
      }
      
      return { success: false, message: "Registration failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
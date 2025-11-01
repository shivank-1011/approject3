import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated after loading
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your expenses and settlements</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p className="stat-value">$0.00</p>
          </div>
          <div className="stat-card">
            <h3>You Owe</h3>
            <p className="stat-value">$0.00</p>
          </div>
          <div className="stat-card">
            <h3>Owed to You</h3>
            <p className="stat-value">$0.00</p>
          </div>
          <div className="stat-card">
            <h3>Active Groups</h3>
            <p className="stat-value">0</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <p className="empty-state">No recent activity</p>
          </div>
        </div>
      </div>
    </>
  );
}
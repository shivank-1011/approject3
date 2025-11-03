import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <h1>Expense Splitter</h1>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          {/* Direct users to Groups so they can pick a group and view expenses */}
          <Link to="/groups" className="navbar-link">Expenses</Link>
          <Link to="/groups" className="navbar-link">Groups</Link>
          <Link to="/settlements" className="navbar-link">Settlements</Link>
          <Link to="/analytics" className="navbar-link">Analytics</Link>
        </div>

        <div className="navbar-user">
          <span className="user-greeting">Hello, {user?.name || 'User'}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
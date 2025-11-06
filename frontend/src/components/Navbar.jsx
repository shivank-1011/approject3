import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    if (path === "/groups") {
      return location.pathname === "/groups";
    }
    if (path === "/expenses") {
      return location.pathname === "/expenses" || location.pathname.startsWith("/expenses/");
    }
    if (path === "/settlements") {
      return location.pathname === "/settlements";
    }
    if (path === "/analytics") {
      return location.pathname.startsWith("/analytics");
    }
    return location.pathname === path;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <h1>SplitEase</h1>
        </Link>

        {/* Hamburger Menu Toggle */}
        <button
          className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop & Mobile Menu */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <Link
            to="/dashboard"
            className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/groups"
            className={`navbar-link ${isActive("/groups") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Groups
          </Link>
          <Link
            to="/expenses"
            className={`navbar-link ${isActive("/expenses") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Expenses
          </Link>
          <Link
            to="/settlements"
            className={`navbar-link ${isActive("/settlements") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Settlements
          </Link>
          <Link
            to="/analytics"
            className={`navbar-link ${isActive("/analytics") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Analytics
          </Link>

          {/* Mobile-only Logout in Menu */}
          <button
            onClick={handleLogout}
            className="navbar-link mobile-logout"
          >
            Logout
          </button>
        </div>

        {/* Desktop User Section */}
        <div className="navbar-user">
          <span className="user-greeting">Hello, {user?.name || 'User'}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="navbar-overlay"
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
}
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GroupProvider } from "./context/GroupContext";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import "./styles/style.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GroupProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
          </Routes>
        </GroupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
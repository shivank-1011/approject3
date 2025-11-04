import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GroupProvider } from "./context/GroupContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Expenses from "./pages/Expenses";
import AllExpenses from "./pages/AllExpenses";
import Settlements from "./pages/Settlements";
import "./styles/style.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GroupProvider>
          <ExpenseProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/expenses" element={<AllExpenses />} />
              <Route path="/expenses/:groupId" element={<Expenses />} />
              <Route path="/settlements" element={<Settlements />} />
            </Routes>
          </ExpenseProvider>
        </GroupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
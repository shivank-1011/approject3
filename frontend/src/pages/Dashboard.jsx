import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const { groups } = useGroups();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalExpenses: 0,
    youOwe: 0,
    owedToYou: 0,
    recentExpenses: []
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user, groups]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);

      let totalExpenses = 0;
      let youOwe = 0;
      let owedToYou = 0;
      let allExpenses = [];

      for (const group of groups) {
        try {
          const expensesResponse = await api.get(`/expenses/${group.id}`);
          if (expensesResponse.data.success) {
            const groupExpenses = expensesResponse.data.data.expenses || [];
            allExpenses = [...allExpenses, ...groupExpenses];

            groupExpenses.forEach(expense => {
              if (expense.paidBy === user.id) {
                totalExpenses += parseFloat(expense.amount);
              }
            });
          }

          const balanceResponse = await api.get(`/expenses/balance/${group.id}`);
          if (balanceResponse.data.success) {
            const transactions = balanceResponse.data.data.transactions || [];

            transactions.forEach(transaction => {
              if (transaction.debtorId === user.id) {
                youOwe += parseFloat(transaction.amount);
              } else if (transaction.creditorId === user.id) {
                owedToYou += parseFloat(transaction.amount);
              }
            });
          }
        } catch (err) {
          console.error(`Error fetching data for group ${group.id}:`, err);
        }
      }

      allExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setDashboardData({
        totalExpenses,
        youOwe,
        owedToYou,
        recentExpenses: allExpenses.slice(0, 5)
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

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
            <p className="stat-value">
              {dataLoading ? "Loading..." : `₹${dashboardData.totalExpenses.toFixed(2)}`}
            </p>
          </div>
          <div className="stat-card">
            <h3>You Owe</h3>
            <p className="stat-value">
              {dataLoading ? "Loading..." : `₹${dashboardData.youOwe.toFixed(2)}`}
            </p>
          </div>
          <div className="stat-card">
            <h3>Owed to You</h3>
            <p className="stat-value">
              {dataLoading ? "Loading..." : `₹${dashboardData.owedToYou.toFixed(2)}`}
            </p>
          </div>
          <div className="stat-card">
            <h3>Active Groups</h3>
            <p className="stat-value">{groups.length}</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            {dataLoading ? (
              <p className="empty-state">Loading recent activity...</p>
            ) : dashboardData.recentExpenses.length > 0 ? (
              <div className="activity-list">
                {dashboardData.recentExpenses.map((expense) => (
                  <div key={expense.id} className="activity-item">
                    <div className="activity-info">
                      <h4>{expense.description}</h4>
                      <p className="activity-date">
                        {new Date(expense.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="activity-amount">
                      <p>₹{parseFloat(expense.amount).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No recent activity</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
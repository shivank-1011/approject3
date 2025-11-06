import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import { useExpenses } from "../context/ExpenseContext";
import api from "../utils/api";
import BalanceChart from "../components/BalanceChart";
import Footer from "../components/Footer";
import "../styles/Analytics.css";

const Analytics = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getGroupById } = useGroups();
  const { expenses, fetchExpenses } = useExpenses();

  const [group, setGroup] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) {
      navigate("/groups");
      return;
    }

    loadAnalyticsData();
  }, [groupId, user]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const groupResult = await getGroupById(groupId);
      if (!groupResult.success) {
        setError("Failed to load group details");
        return;
      }
      setGroup(groupResult.data);

      await fetchExpenses(groupId);

      const analyticsResponse = await api.get(`/analytics/${groupId}`);
      if (analyticsResponse.data.success) {
        setAnalytics(analyticsResponse.data.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError(err.response?.data?.error || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const calculateUserTotalPaid = () => {
    if (!expenses || !user) return 0;
    return expenses
      .filter((expense) => expense.paidBy === user.id)
      .reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const calculateUserShare = () => {
    if (!expenses || !user) return 0;
    let totalShare = 0;

    expenses.forEach((expense) => {
      const split = expense.splits?.find((s) => s.userId === user.id);
      if (split) {
        totalShare += parseFloat(split.amount);
      }
    });

    return totalShare;
  };

  const calculateNetBalance = () => {
    const totalPaid = calculateUserTotalPaid();
    const totalShare = calculateUserShare();
    return totalPaid - totalShare;
  };

  const getContributionData = () => {
    if (!analytics?.topSpenders || analytics.topSpenders.length === 0) {
      return [];
    }

    const colors = ["#3498db", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c"];

    return analytics.topSpenders.map((spender, index) => ({
      name: spender.user?.name || "Unknown",
      value: parseFloat(spender.totalSpent),
      color: colors[index % colors.length],
    }));
  };

  const getExpenseTrendData = () => {
    if (!expenses || expenses.length === 0) return [];

    const monthlyData = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          amount: 0,
          count: 0,
        };
      }

      monthlyData[monthKey].amount += parseFloat(expense.amount);
      monthlyData[monthKey].count += 1;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const totalGroupExpense = analytics?.totalExpense || 0;
  const userTotalPaid = calculateUserTotalPaid();
  const netBalance = calculateNetBalance();
  const contributionData = getContributionData();
  const trendData = getExpenseTrendData();

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => navigate("/groups")} className="btn-back">
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <button onClick={() => navigate(`/expenses/${groupId}`)} className="btn-back-nav">
          ← Back
        </button>
        <div className="header-content">
          <h1 className="page-title">📊 Analytics Dashboard</h1>
          <p className="page-subtitle">{group?.name || "Group Analytics"}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-cards">
        {/* Card 1: Total Group Expense */}
        <div className="analytics-card card-total">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3 className="card-label">Total Group Expense</h3>
            <p className="card-value">₹{totalGroupExpense.toFixed(2)}</p>
            <p className="card-detail">
              {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} recorded
            </p>
          </div>
        </div>

        {/* Card 2: Your Total Paid */}
        <div className="analytics-card card-paid">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <h3 className="card-label">Your Total Paid</h3>
            <p className="card-value">₹{userTotalPaid.toFixed(2)}</p>
            <p className="card-detail">
              {((userTotalPaid / totalGroupExpense) * 100 || 0).toFixed(1)}% of total
            </p>
          </div>
        </div>

        {/* Card 3: Net Balance */}
        <div className={`analytics-card ${netBalance >= 0 ? "card-owed" : "card-owe"}`}>
          <div className="card-icon">{netBalance >= 0 ? "✅" : "⚠️"}</div>
          <div className="card-content">
            <h3 className="card-label">
              {netBalance >= 0 ? "You Are Owed" : "You Owe"}
            </h3>
            <p className="card-value">
              ₹{Math.abs(netBalance).toFixed(2)}
            </p>
            <p className="card-detail">
              {netBalance >= 0
                ? "Others owe you money"
                : "Settle up to clear balance"}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Contribution Pie Chart */}
        <div className="chart-container">
          <BalanceChart
            contributionData={contributionData}
            trendData={trendData}
            totalExpense={totalGroupExpense}
            userPaid={userTotalPaid}
            netBalance={netBalance}
          />
        </div>

        {/* Top Spenders List */}
        {analytics?.topSpenders && analytics.topSpenders.length > 0 && (
          <div className="top-spenders-container">
            <h2 className="section-title">🏆 Top Contributors</h2>
            <div className="top-spenders-list">
              {analytics.topSpenders.map((spender, index) => {
                const percentage = (spender.totalSpent / totalGroupExpense) * 100;
                const medals = ["🥇", "🥈", "🥉"];

                return (
                  <div key={spender.user?.id} className="spender-item">
                    <div className="spender-rank">
                      <span className="rank-badge">{medals[index] || `#${index + 1}`}</span>
                    </div>
                    <div className="spender-info">
                      <h4 className="spender-name">{spender.user?.name || "Unknown"}</h4>
                      <p className="spender-email">{spender.user?.email || ""}</p>
                    </div>
                    <div className="spender-stats">
                      <p className="spender-amount">₹{parseFloat(spender.totalSpent).toFixed(2)}</p>
                      <div className="spender-bar">
                        <div
                          className="spender-bar-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getContributionData()[index]?.color || "#3498db"
                          }}
                        ></div>
                      </div>
                      <p className="spender-percentage">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {expenses.length > 0 && (
          <div className="recent-activity-container">
            <h2 className="section-title">📝 Recent Expenses</h2>
            <div className="recent-activity-list">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="activity-item">
                  <div className="activity-icon">💵</div>
                  <div className="activity-info">
                    <h4 className="activity-description">{expense.description}</h4>
                    <p className="activity-date">
                      {new Date(expense.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="activity-amount">
                    <p className="amount-value">₹{parseFloat(expense.amount).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            {expenses.length > 5 && (
              <button
                onClick={() => navigate(`/expenses/${groupId}`)}
                className="btn-view-all"
              >
                View All Expenses →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {expenses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Data Yet</h3>
          <p>Add some expenses to see analytics and insights</p>
          <button
            onClick={() => navigate(`/expenses/${groupId}`)}
            className="btn-add-expense"
          >
            Add First Expense
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Analytics;
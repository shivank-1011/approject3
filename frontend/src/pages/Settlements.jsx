import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import Navbar from "../components/Navbar";
import BalanceChart from "../components/BalanceChart";
import api from "../utils/api";
import "../styles/Expenses.css";

export default function Settlements() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();
  const navigate = useNavigate();

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    // Auto-select first group if available
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id.toString());
    }
  }, [groups, selectedGroupId]);

  useEffect(() => {
    // Fetch balances when group is selected
    if (selectedGroupId) {
      fetchBalances(selectedGroupId);
    }
  }, [selectedGroupId]);

  const fetchBalances = async (groupId) => {
    if (!groupId) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/expenses/balance/${groupId}`);
      
      if (response.data.success) {
        setBalances(response.data.data.transactions || []);
      } else {
        setError(response.data.message || "Failed to fetch balances");
      }
    } catch (err) {
      console.error("Error fetching balances:", err);
      setError(err.response?.data?.message || "Failed to fetch balances");
      setBalances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (e) => {
    setSelectedGroupId(e.target.value);
  };

  const getCurrentGroup = () => {
    return groups.find((g) => g.id.toString() === selectedGroupId);
  };

  // Show loading state while checking authentication
  if (authLoading || groupsLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const currentGroup = getCurrentGroup();

  return (
    <>
      <Navbar />
      <div className="expenses-container">
        {/* Header */}
        <div className="expenses-header">
          <div className="header-content">
            <h1>💰 Settlements & Balances</h1>
            <p>See who owes whom and settle your debts</p>
          </div>
        </div>

        {/* Group Filter */}
        {groups.length > 0 && (
          <div className="expenses-filter">
            <label htmlFor="groupSelect">Select Group:</label>
            <select
              id="groupSelect"
              className="group-filter-select"
              value={selectedGroupId}
              onChange={handleGroupChange}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2>No Groups Found</h2>
            <p>Create or join a group to start tracking settlements</p>
            <button className="btn-primary" onClick={() => navigate("/groups")}>
              Go to Groups
            </button>
          </div>
        ) : loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading balances...</p>
          </div>
        ) : (
          <div className="expenses-content">
            {/* Balance Chart */}
            {balances.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <BalanceChart 
                  balances={balances} 
                  currentUserId={user?.id}
                  groupName={currentGroup?.name}
                />
              </div>
            )}

            {/* Balances List */}
            <div className="settlements-section">
              <h2 style={{ 
                fontSize: "1.5rem", 
                color: "#2c3e50", 
                marginBottom: "1.5rem",
                fontWeight: "700"
              }}>
                {currentGroup?.name ? `Balances in ${currentGroup.name}` : "Group Balances"}
              </h2>

              {balances.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✅</div>
                  <h2>All Settled Up!</h2>
                  <p>No pending balances in this group</p>
                </div>
              ) : (
                <div className="balances-list">
                  {balances.map((balance, index) => {
                    const isUserDebtor = balance.debtorId === user?.id;
                    const isUserCreditor = balance.creditorId === user?.id;

                    return (
                      <div 
                        key={index} 
                        className={`balance-card ${isUserDebtor ? 'you-owe' : ''} ${isUserCreditor ? 'owes-you' : ''}`}
                      >
                        <div className="balance-info">
                          <div className="balance-participants">
                            <div className="participant-debtor">
                              <span className="participant-name">
                                {balance.debtorName}
                                {isUserDebtor && <span className="you-badge">YOU</span>}
                              </span>
                            </div>
                            <div className="balance-arrow">→</div>
                            <div className="participant-creditor">
                              <span className="participant-name">
                                {balance.creditorName}
                                {isUserCreditor && <span className="you-badge">YOU</span>}
                              </span>
                            </div>
                          </div>
                          <div className="balance-description">
                            {balance.debtorName} owes {balance.creditorName}
                          </div>
                        </div>
                        <div className="balance-amount">
                          ₹{balance.amount.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .settlements-section {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .balances-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .balance-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px solid #e1e8ed;
          transition: all 0.3s ease;
        }

        .balance-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .balance-card.you-owe {
          background: #fff4f4;
          border-color: #fcc;
        }

        .balance-card.owes-you {
          background: #f0fff4;
          border-color: #c6f6d5;
        }

        .balance-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .balance-participants {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .participant-debtor,
        .participant-creditor {
          display: flex;
          align-items: center;
        }

        .participant-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .balance-arrow {
          font-size: 1.5rem;
          color: #667eea;
          font-weight: 700;
        }

        .balance-description {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-top: 0.25rem;
        }

        .balance-amount {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          margin-left: 1rem;
        }

        .you-badge {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .balance-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .balance-amount {
            margin-left: 0;
            font-size: 1.5rem;
            align-self: flex-end;
          }

          .balance-participants {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .balance-arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </>
  );
}
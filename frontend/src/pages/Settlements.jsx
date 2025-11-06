import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import { useExpenses } from "../context/ExpenseContext";
import Navbar from "../components/Navbar";
import BalanceChart from "../components/BalanceChart";
import Footer from "../components/Footer";
import api from "../utils/api";
import "../styles/Expenses.css";

export default function Settlements() {
    const { isAuthenticated, loading: authLoading, user } = useAuth();
    const { groups, loading: groupsLoading } = useGroups();
    const { balances, fetchBalances, loading: balancesLoading, error } = useExpenses();
    const navigate = useNavigate();

    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [settlingBalance, setSettlingBalance] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/");
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (groups.length > 0 && !selectedGroupId) {
            setSelectedGroupId(groups[0].id.toString());
        }
    }, [groups, selectedGroupId]);

    useEffect(() => {
        if (selectedGroupId) {
            fetchBalances(selectedGroupId);
        }
    }, [selectedGroupId]);

    const handleGroupChange = (e) => {
        setSelectedGroupId(e.target.value);
    };

    const getCurrentGroup = () => {
        return groups.find((g) => g.id.toString() === selectedGroupId);
    };

    const handleSettleUp = async (balance) => {
        const confirmMessage = `Confirm settlement: ${balance.debtorName} pays ₹${balance.amount.toFixed(2)} to ${balance.creditorName}?`;
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setSettlingBalance(balance);

        try {
            const response = await api.post("/settlements/record", {
                groupId: parseInt(selectedGroupId),
                paidTo: balance.creditorId,
                amount: balance.amount,
            });

            if (response.data.success) {
                setSuccessMessage("Settlement recorded successfully! 🎉");

                await fetchBalances(selectedGroupId);

                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            }
        } catch (err) {
            console.error("Failed to record settlement:", err);
            alert(err.response?.data?.message || "Failed to record settlement");
        } finally {
            setSettlingBalance(null);
        }
    };

    if (authLoading || groupsLoading) {
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

                {/* Success Display */}
                {successMessage && (
                    <div className="success-banner">
                        <span>✅</span>
                        <span>{successMessage}</span>
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
                ) : balancesLoading ? (
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
                                        const canSettle = isUserDebtor; // Only debtor can settle

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
                                                <div className="balance-actions">
                                                    <div className="balance-amount">
                                                        ₹{balance.amount.toFixed(2)}
                                                    </div>
                                                    {canSettle && (
                                                        <button
                                                            className="settle-btn"
                                                            onClick={() => handleSettleUp(balance)}
                                                            disabled={settlingBalance !== null}
                                                        >
                                                            {settlingBalance === balance ? "Processing..." : "Settle Up"}
                                                        </button>
                                                    )}
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
          padding: 2rem 5rem;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .success-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 12px;
          color: #155724;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        .balance-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
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
        }

        .settle-btn {
          padding: 0.6rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .settle-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .settle-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

          .balance-actions {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .balance-amount {
            font-size: 1.5rem;
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
            <Footer />
        </>
    );
}






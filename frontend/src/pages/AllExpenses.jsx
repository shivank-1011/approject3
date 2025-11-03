import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import api from "../utils/api";
import "../styles/Expenses.css";

const AllExpenses = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { groups } = useGroups();
    
    const [allExpenses, setAllExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState("all");

    // Fetch all expenses from all groups
    useEffect(() => {
        fetchAllExpenses();
    }, [groups]);

    const fetchAllExpenses = async () => {
        if (!groups || groups.length === 0) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch expenses from all groups
            const expensePromises = groups.map(group => 
                api.get(`/expenses/${group.id}`)
                    .then(response => ({
                        groupId: group.id,
                        groupName: group.name,
                        expenses: response.data.success ? response.data.data.expenses : []
                    }))
                    .catch(err => ({
                        groupId: group.id,
                        groupName: group.name,
                        expenses: []
                    }))
            );

            const results = await Promise.all(expensePromises);
            
            // Flatten all expenses and add group info
            const expenses = results.flatMap(result => 
                result.expenses.map(expense => ({
                    ...expense,
                    groupId: result.groupId,
                    groupName: result.groupName
                }))
            );

            // Sort by date (newest first)
            expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setAllExpenses(expenses);
        } catch (err) {
            console.error("Failed to fetch expenses:", err);
            setError("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }

        try {
            const response = await api.delete(`/expenses/${expenseId}`);
            if (response.data.success) {
                // Remove expense from state
                setAllExpenses(prev => prev.filter(expense => expense.id !== expenseId));
            } else {
                alert("Failed to delete expense");
            }
        } catch (err) {
            console.error("Failed to delete expense:", err);
            alert(err.response?.data?.message || "Failed to delete expense");
        }
    };

    const filteredExpenses = selectedGroup === "all" 
        ? allExpenses 
        : allExpenses.filter(expense => expense.groupId === parseInt(selectedGroup));

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="expenses-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading expenses...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="expenses-container">
                {/* Header */}
                <div className="expenses-header">
                    <div className="header-content">
                        <h1>All Expenses</h1>
                        <p>View and manage expenses across all your groups</p>
                    </div>
                </div>

                {/* Filter by Group */}
                {groups.length > 0 && (
                    <div className="expenses-filter">
                        <label htmlFor="group-filter">Filter by Group:</label>
                        <select 
                            id="group-filter"
                            value={selectedGroup} 
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="group-filter-select"
                        >
                            <option value="all">All Groups</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {/* Expenses List */}
                <div className="expenses-content">
                    {groups.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <h2>No groups yet</h2>
                            <p>Create or join a group to start tracking expenses</p>
                            <button className="btn-primary" onClick={() => navigate("/groups")}>
                                Go to Groups
                            </button>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💸</div>
                            <h2>No expenses yet</h2>
                            <p>
                                {selectedGroup === "all" 
                                    ? "Start by adding expenses to your groups" 
                                    : "No expenses found for this group"}
                            </p>
                            <button className="btn-primary" onClick={() => navigate("/groups")}>
                                Add Expense to a Group
                            </button>
                        </div>
                    ) : (
                        <div className="expenses-list">
                            {filteredExpenses.map((expense) => (
                                <div key={expense.id} className="expense-with-group">
                                    <div className="expense-group-badge">
                                        {expense.groupName}
                                    </div>
                                    <ExpenseCard
                                        expense={expense}
                                        onDelete={handleDeleteExpense}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllExpenses;

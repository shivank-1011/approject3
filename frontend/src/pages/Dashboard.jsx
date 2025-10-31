import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BalanceChart from '../components/BalanceChart';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState({
        totalOwed: 0,
        totalOwing: 0,
        recentExpenses: []
    });

    useEffect(() => {
        // Fetch dashboard data
    }, []);

    return (
        <div className="dashboard">
            <h1>Welcome, {user?.name || 'User'}!</h1>
            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>You Owe</h3>
                    <p className="amount negative">${summary.totalOwing.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>You Are Owed</h3>
                    <p className="amount positive">${summary.totalOwed.toFixed(2)}</p>
                </div>
            </div>
            <div className="recent-activity">
                <h2>Recent Expenses</h2>
                {/* Display recent expenses */}
            </div>
        </div>
    );
};

export default Dashboard;

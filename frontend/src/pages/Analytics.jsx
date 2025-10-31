import React, { useEffect, useState } from 'react';
import '../styles/Analytics.css';

const Analytics = () => {
    const [analytics, setAnalytics] = useState({
        totalSpent: 0,
        categoryBreakdown: [],
        monthlyTrend: []
    });

    useEffect(() => {
        // Fetch analytics data
    }, []);

    return (
        <div className="analytics-page">
            <h1>Analytics</h1>
            <div className="analytics-summary">
                <div className="stat-card">
                    <h3>Total Spent</h3>
                    <p>${analytics.totalSpent.toFixed(2)}</p>
                </div>
            </div>
            <div className="analytics-charts">
                <h2>Spending by Category</h2>
                {/* Add charts here */}
            </div>
        </div>
    );
};

export default Analytics;

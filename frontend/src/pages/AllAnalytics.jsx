import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import Navbar from "../components/Navbar";
import GroupCard from "../components/GroupCard";
import Footer from "../components/Footer";
import "../styles/Groups.css";

export default function AllAnalytics() {
    const { isAuthenticated, loading } = useAuth();
    const { groups, loading: groupsLoading } = useGroups();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/");
        }
    }, [loading, isAuthenticated, navigate]);

    const handleGroupClick = (groupId) => {
        navigate(`/analytics/${groupId}`);
    };

    if (loading || groupsLoading) {
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
            <div className="groups-container">
                <div className="groups-header">
                    <h1>📊 Select a Group for Analytics</h1>
                    <p>Choose a group to view detailed analytics and insights</p>
                </div>

                {groups.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h3>No Groups Yet</h3>
                        <p>Create or join a group to view analytics</p>
                        <button
                            onClick={() => navigate("/groups")}
                            className="btn-primary"
                        >
                            Go to Groups
                        </button>
                    </div>
                ) : (
                    <div className="groups-grid">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                onClick={() => handleGroupClick(group.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <GroupCard group={group} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

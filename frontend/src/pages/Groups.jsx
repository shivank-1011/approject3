import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import Navbar from "../components/Navbar";
import GroupCard from "../components/GroupCard";
import Footer from "../components/Footer";
import "../styles/Groups.css";

export default function Groups() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { groups, loading, createGroup, joinGroupByCode, fetchGroups } = useGroups();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
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

  const handleOpenModal = () => {
    setShowModal(true);
    setError("");
    setGroupName("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setGroupName("");
  };

  const handleOpenJoinModal = () => {
    setShowJoinModal(true);
    setError("");
    setJoinCode("");
  };

  const handleCloseJoinModal = () => {
    setShowJoinModal(false);
    setError("");
    setJoinCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (groupName.trim().length < 3) {
      setError("Group name must be at least 3 characters");
      return;
    }

    if (groupName.trim().length > 50) {
      setError("Group name must be less than 50 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createGroup(groupName.trim());

      if (result.success) {
        handleCloseModal();
      } else {
        setError(result.message || "Failed to create group");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!joinCode.trim()) {
      setError("Join code is required");
      return;
    }

    if (joinCode.trim().length < 6) {
      setError("Please enter a valid join code");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await joinGroupByCode(joinCode.trim());

      if (result.success) {
        handleCloseJoinModal();
      } else {
        setError(result.message || "Failed to join group");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="groups-container">
        <div className="groups-header">
          <div className="header-content">
            <h1>My Groups</h1>
            <p>Manage and track expenses with your groups</p>
          </div>
          <div className="header-actions">
            <button className="btn-join-group" onClick={handleOpenJoinModal}>
              Join Group
            </button>
            <button className="btn-new-group" onClick={handleOpenModal}>
              <span className="plus-icon">+</span>
              New Group
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2>No Groups Yet</h2>
            <p>Create your first group to start tracking expenses with friends!</p>
            <button className="btn-primary" onClick={handleOpenModal}>
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="groups-grid">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}

        {/* Modal for creating new group */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Group</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="groupName">Group Name</label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name (e.g., Weekend Trip)"
                    className={error ? "input-error" : ""}
                    disabled={isSubmitting}
                    autoFocus
                  />
                  {error && <span className="error-message">{error}</span>}
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Group"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for joining group by code */}
        {showJoinModal && (
          <div className="modal-overlay" onClick={handleCloseJoinModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Join Group</h2>
                <button className="modal-close" onClick={handleCloseJoinModal}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleJoinSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="joinCode">Join Code</label>
                  <input
                    type="text"
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter group join code (e.g., ABC12345)"
                    className={error ? "input-error" : ""}
                    disabled={isSubmitting}
                    autoFocus
                  />
                  {error && <span className="error-message">{error}</span>}
                  <small style={{ display: 'block', marginTop: '0.5rem', color: '#7f8c8d' }}>
                    Ask the group admin for the join code
                  </small>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCloseJoinModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining..." : "Join Group"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
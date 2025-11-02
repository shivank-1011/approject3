import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import Navbar from "../components/Navbar";
import GroupCard from "../components/GroupCard";
import "../styles/Groups.css";

export default function Groups() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { groups, loading, createGroup, fetchGroups } = useGroups();
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated after loading
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
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
        // Success! Close modal and refresh groups
        handleCloseModal();
        // Groups list will be automatically updated by context
      } else {
        setError(result.message || "Failed to create group");
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
          <button className="btn-new-group" onClick={handleOpenModal}>
            <span className="plus-icon">+</span>
            New Group
          </button>
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
      </div>
    </>
  );
}
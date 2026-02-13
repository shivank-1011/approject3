import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import api from "../utils/api";
import "../styles/Groups.css";
import AnimatedIcon from "./AnimatedIcon";
import trashAnimation from "../assets/animations/trash.json";
import copyAnimation from "../assets/animations/copy.json";
import checkAnimation from "../assets/animations/success.json";

export default function GroupCard({ group }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addMemberToGroup, removeMemberFromGroup, deleteGroup } = useGroups();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasBalances, setHasBalances] = useState(false);
  const [checkingBalances, setCheckingBalances] = useState(false);

  useEffect(() => {
    const checkBalances = async () => {
      try {
        setCheckingBalances(true);
        const response = await api.get(`/expenses/balance/${group.id}`);
        if (response.data.success) {
          const transactions = response.data.data.transactions || [];
          setHasBalances(transactions.length > 0);
        }
      } catch (err) {
        console.error("Failed to check balances:", err);
        setHasBalances(false);
      } finally {
        setCheckingBalances(false);
      }
    };

    checkBalances();
  }, [group.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewExpenses = (e) => {
    e.stopPropagation();
    navigate(`/expenses/${group.id}`);
  };

  const handleManageMembers = (e) => {
    e.stopPropagation();
    setShowMembersModal(true);
  };

  const closeMembersModal = () => {
    setShowMembersModal(false);
    setShowAddMemberModal(false);
    setNewMemberEmail("");
    setError("");
    setCopySuccess(false);
  };

  const handleCopyJoinCode = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(group.joinCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");

    if (!newMemberEmail.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail.trim())) {
      setError("Invalid email format");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addMemberToGroup(group.id, newMemberEmail.trim());

      if (result.success) {
        setNewMemberEmail("");
        setShowAddMemberModal(false);
        setError("");
      } else {
        setError(result.message || "Failed to add member");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await removeMemberFromGroup(group.id, memberId);

      if (!result.success) {
        setError(result.message || "Failed to remove member");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = async (e) => {
    e.stopPropagation();

    if (hasBalances) {
      alert("Cannot delete group with pending settlements!\n\nPlease ensure all members have settled their balances before deleting the group.");
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${group.name}"?\n\nThis will permanently delete:\n• All expenses in this group\n• All settlements\n• All member data\n\nThis action cannot be undone!`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await deleteGroup(group.id);

      if (result.success) {
        closeMembersModal();
      } else {
        setError(result.message || "Failed to delete group");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentUserMember = group.members?.find(
    (member) => member.userId === user?.id
  );
  const isAdmin = currentUserMember?.role === "admin";

  return (
    <>
      <div className="group-card">
        <div className="group-card-header">
          <h3 className="group-name">{group.name}</h3>
          <span className="member-count">
            {group._count?.members || group.members?.length || 0} members
          </span>
        </div>

        <div className="group-card-body">
          <div className="group-info">
            <span className="info-label">Created by:</span>
            <span className="info-value">
              {group.createdByUser?.name || "Unknown"}
            </span>
          </div>

          <div className="group-info">
            <span className="info-label">Created on:</span>
            <span className="info-value">{formatDate(group.createdAt)}</span>
          </div>

          {group.joinCode && (
            <div className="group-info">
              <span className="info-label">Join Code:</span>
              <div className="join-code-container">
                <span className="join-code-value">{group.joinCode}</span>
                <button
                  className="btn-copy"
                  onClick={handleCopyJoinCode}
                  title="Copy join code"
                >
                  {copySuccess ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AnimatedIcon animationData={checkAnimation} width="16px" height="16px" />
                      Copied
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AnimatedIcon animationData={copyAnimation} width="16px" height="16px" />
                      Copy
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="group-card-footer">
          <button className="btn-secondary" onClick={handleManageMembers}>
            Manage Members
          </button>
          <button className="btn-view" onClick={handleViewExpenses}>
            View Expenses
          </button>
          {isAdmin && (
            <button
              className="btn-delete"
              onClick={handleDeleteGroup}
              disabled={isSubmitting || hasBalances || checkingBalances}
              title={
                hasBalances
                  ? "Cannot delete - pending settlements exist"
                  : checkingBalances
                    ? "Checking balances..."
                    : "Delete group (Admin only)"
              }
            >
              {hasBalances ? "Settle First" : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AnimatedIcon animationData={trashAnimation} width="16px" height="16px" />
                  Delete
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="modal-overlay" onClick={closeMembersModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Group Members - {group.name}</h2>
              <button className="modal-close" onClick={closeMembersModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}

              {isAdmin && !showAddMemberModal && (
                <button
                  className="btn-primary mb-3"
                  onClick={() => setShowAddMemberModal(true)}
                  style={{ marginBottom: "1rem" }}
                >
                  + Add Member
                </button>
              )}

              {showAddMemberModal && (
                <form onSubmit={handleAddMember} className="add-member-form">
                  <div className="form-group">
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowAddMemberModal(false);
                        setNewMemberEmail("");
                        setError("");
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                  </div>
                </form>
              )}

              <div className="members-list">
                {group.members?.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-info">
                      <div className="member-name">{member.user.name}</div>
                      <div className="member-email">{member.user.email}</div>
                    </div>
                    <div className="member-actions">
                      {member.role === "admin" && (
                        <span className="badge-admin">Admin</span>
                      )}
                      {isAdmin && member.userId !== user?.id && (
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      )}
                      {!isAdmin && member.userId === user?.id && (
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={isSubmitting}
                        >
                          Leave Group
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
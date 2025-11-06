import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import { useGroups } from "../context/GroupContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import Footer from "../components/Footer";
import "../styles/Expenses.css";

const Expenses = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { expenses, loading, error, fetchExpenses, addExpenseEqualSplit, deleteExpense } = useExpenses();
    const { getGroupById } = useGroups();

    const [group, setGroup] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        paidBy: "",
        participants: [],
    });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (groupId) {
            loadGroupData();
            fetchExpenses(groupId);
        }
    }, [groupId]);

    const loadGroupData = async () => {
        const result = await getGroupById(groupId);
        if (result.success) {
            setGroup(result.data);
            if (user) {
                setFormData((prev) => ({ ...prev, paidBy: user.id.toString() }));
            }
        } else {
            console.error("Failed to load group:", result.message);
        }
    };

    const openModal = () => {
        setShowModal(true);
        setFormError("");
        setFormData({
            description: "",
            amount: "",
            paidBy: user ? user.id.toString() : "",
            participants: [],
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setFormError("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError("");
    };

    const handleParticipantToggle = (memberId) => {
        setFormData((prev) => {
            const participants = prev.participants.includes(memberId)
                ? prev.participants.filter((id) => id !== memberId)
                : [...prev.participants, memberId];
            return { ...prev, participants };
        });
    };

    const handleSelectAllParticipants = () => {
        if (!group || !group.members) return;

        const allMemberIds = group.members.map((member) => member.userId.toString());
        setFormData((prev) => ({ ...prev, participants: allMemberIds }));
    };

    const handleDeselectAllParticipants = () => {
        setFormData((prev) => ({ ...prev, participants: [] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.description.trim()) {
            setFormError("Please enter a description");
            return;
        }

        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            setFormError("Please enter a valid amount greater than 0");
            return;
        }

        if (!formData.paidBy) {
            setFormError("Please select who paid");
            return;
        }

        if (formData.participants.length === 0) {
            setFormError("Please select at least one participant");
            return;
        }

        setSubmitting(true);

        const expenseData = {
            description: formData.description.trim(),
            amount: amount,
            paidBy: parseInt(formData.paidBy),
            groupId: parseInt(groupId),
            participants: formData.participants.map((id) => parseInt(id)),
        };

        const result = await addExpenseEqualSplit(expenseData);

        if (result.success) {
            closeModal();
            await fetchExpenses(groupId);
        } else {
            setFormError(result.message || "Failed to add expense");
        }

        setSubmitting(false);
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }

        const result = await deleteExpense(expenseId, groupId);
        if (result.success) {
            console.log("Expense deleted successfully");
        } else {
            alert(result.message || "Failed to delete expense");
        }
    };

    if (loading && !group) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading expenses...</p>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="expenses-container">
                <div className="empty-state">
                    <div className="empty-icon">❌</div>
                    <h2>Group not found</h2>
                    <p>The group you're looking for doesn't exist or you don't have access to it.</p>
                    <button className="btn-primary" onClick={() => navigate("/groups")}>
                        Back to Groups
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="expenses-container">
                {/* Header */}
                <div className="expenses-header">
                    <button className="btn-back" onClick={() => navigate("/groups")}>
                        ← Back to Groups
                    </button>
                    <div className="header-content">
                        <h1>{group.name}</h1>
                        <p>Manage and track all expenses for this group</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-analytics" onClick={() => navigate(`/analytics/${groupId}`)}>
                            📊 View Analytics
                        </button>
                        <button className="btn-add-expense" onClick={openModal}>
                            <span className="plus-icon">+</span>
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {/* Expenses List */}
                <div className="expenses-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading expenses...</p>
                        </div>
                    ) : expenses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💸</div>
                            <h2>No expenses yet</h2>
                            <p>Start by adding your first expense to this group</p>
                            <button className="btn-primary" onClick={openModal}>
                                Add Your First Expense
                            </button>
                        </div>
                    ) : (
                        <div className="expenses-list">
                            {expenses.map((expense) => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    onDelete={handleDeleteExpense}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Expense Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Expense</h2>
                                <button className="modal-close" onClick={closeModal}>
                                    ×
                                </button>
                            </div>

                            <form className="modal-form" onSubmit={handleSubmit}>
                                {/* Description */}
                                <div className="form-group">
                                    <label htmlFor="description">Description *</label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        placeholder="e.g., Dinner at restaurant"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        disabled={submitting}
                                        className={formError && !formData.description.trim() ? "input-error" : ""}
                                    />
                                </div>

                                {/* Amount */}
                                <div className="form-group">
                                    <label htmlFor="amount">Amount (₹) *</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0.01"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        disabled={submitting}
                                        className={formError && (!formData.amount || parseFloat(formData.amount) <= 0) ? "input-error" : ""}
                                    />
                                </div>

                                {/* Paid By */}
                                <div className="form-group">
                                    <label htmlFor="paidBy">Paid By *</label>
                                    <select
                                        id="paidBy"
                                        name="paidBy"
                                        value={formData.paidBy}
                                        onChange={handleInputChange}
                                        disabled={submitting}
                                        className={formError && !formData.paidBy ? "input-error" : ""}
                                    >
                                        <option value="">Select payer...</option>
                                        {group.members &&
                                            group.members.map((member) => (
                                                <option key={member.userId} value={member.userId}>
                                                    {member.user?.name || `User ${member.userId}`}
                                                    {user && member.userId === user.id ? " (You)" : ""}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Participants */}
                                <div className="form-group">
                                    <label>Split Between (Equal Split) *</label>
                                    <div className="participants-actions">
                                        <button
                                            type="button"
                                            className="btn-select-action"
                                            onClick={handleSelectAllParticipants}
                                            disabled={submitting}
                                        >
                                            Select All
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-select-action"
                                            onClick={handleDeselectAllParticipants}
                                            disabled={submitting}
                                        >
                                            Deselect All
                                        </button>
                                    </div>
                                    <div className="participants-checkboxes">
                                        {group.members &&
                                            group.members.map((member) => (
                                                <label key={member.userId} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.participants.includes(member.userId.toString())}
                                                        onChange={() => handleParticipantToggle(member.userId.toString())}
                                                        disabled={submitting}
                                                    />
                                                    <span>
                                                        {member.user?.name || `User ${member.userId}`}
                                                        {user && member.userId === user.id ? " (You)" : ""}
                                                    </span>
                                                </label>
                                            ))}
                                    </div>
                                    {formData.participants.length > 0 && (
                                        <p className="split-info">
                                            Each person pays: ₹{(parseFloat(formData.amount) / formData.participants.length || 0).toFixed(2)}
                                        </p>
                                    )}
                                </div>

                                {/* Error Message */}
                                {formError && <div className="error-message">{formError}</div>}

                                {/* Actions */}
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={closeModal}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit" disabled={submitting}>
                                        {submitting ? "Adding..." : "Add Expense"}
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
};

export default Expenses;
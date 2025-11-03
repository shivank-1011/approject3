import React from "react";
import { useAuth } from "../context/AuthContext";

const ExpenseCard = ({ expense, onDelete }) => {
    const { user } = useAuth();

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format amount
    const formatAmount = (amount) => {
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    // Check if current user can delete this expense
    const canDelete = user && (expense.paidBy === user.id || user.id === expense.group?.createdBy);

    return (
        <div className="expense-card">
            <div className="expense-card-header">
                <div className="expense-info">
                    <h3 className="expense-description">{expense.description}</h3>
                    <p className="expense-date">{formatDate(expense.createdAt)}</p>
                </div>
                <div className="expense-amount">{formatAmount(expense.amount)}</div>
            </div>

            <div className="expense-card-body">
                <div className="expense-detail">
                    <span className="detail-label">Paid by:</span>
                    <span className="detail-value">
                        {expense.paidByUser?.name || "Unknown"}
                        {user && expense.paidBy === user.id && (
                            <span className="you-badge">You</span>
                        )}
                    </span>
                </div>

                {expense.splits && expense.splits.length > 0 && (
                    <div className="expense-detail">
                        <span className="detail-label">Split between:</span>
                        <div className="participants-list">
                            {expense.splits.map((split) => (
                                <div key={split.id} className="participant-item">
                                    <span className="participant-name">
                                        {split.user?.name || "Unknown"}
                                        {user && split.userId === user.id && (
                                            <span className="you-badge-small">You</span>
                                        )}
                                    </span>
                                    <span className="participant-amount">
                                        {formatAmount(split.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {canDelete && onDelete && (
                <div className="expense-card-footer">
                    <button
                        className="btn-delete-expense"
                        onClick={() => onDelete(expense.id)}
                        title="Delete expense"
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpenseCard;
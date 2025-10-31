import React from 'react';

const ExpenseCard = ({ expense }) => {
    return (
        <div className="expense-card">
            <h3>{expense.description}</h3>
            <p>Amount: ${expense.amount}</p>
            <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
            <p>Paid by: {expense.paidBy}</p>
        </div>
    );
};

export default ExpenseCard;

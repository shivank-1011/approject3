import React, { useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import ExpenseCard from '../components/ExpenseCard';
import '../styles/Expenses.css';

const Expenses = () => {
    const { expenses, fetchExpenses, createExpense } = useExpense();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleAddExpense = () => {
        // Open modal or form to add new expense
    };

    return (
        <div className="expenses-page">
            <div className="expenses-header">
                <h1>Expenses</h1>
                <button onClick={handleAddExpense}>Add Expense</button>
            </div>
            <div className="expenses-list">
                {expenses.map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} />
                ))}
            </div>
        </div>
    );
};

export default Expenses;

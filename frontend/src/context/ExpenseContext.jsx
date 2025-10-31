import React, { createContext, useState, useContext } from 'react';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = async (groupId) => {
        // Fetch expenses from API
    };

    const createExpense = async (expenseData) => {
        // Create new expense
    };

    const updateExpense = async (expenseId, expenseData) => {
        // Update existing expense
    };

    const deleteExpense = async (expenseId) => {
        // Delete expense
    };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            fetchExpenses,
            createExpense,
            updateExpense,
            deleteExpense
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpense = () => useContext(ExpenseContext);

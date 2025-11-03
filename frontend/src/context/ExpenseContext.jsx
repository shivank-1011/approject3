import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(null);

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error("useExpenses must be used within an ExpenseProvider");
    }
    return context;
};

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    // Fetch all expenses for a group
    const fetchExpenses = async (groupId) => {
        if (!isAuthenticated || !groupId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/expenses/${groupId}`);

            if (response.data.success) {
                setExpenses(response.data.data.expenses || []);
            }
        } catch (err) {
            console.error("Failed to fetch expenses:", err);
            setError(err.response?.data?.message || "Failed to fetch expenses");
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    // Add a new expense with equal splits
    const addExpenseEqualSplit = async (expenseData) => {
        try {
            setError(null);
            const response = await api.post("/expenses/equal", expenseData);

            if (response.data.success) {
                const newExpense = response.data.data;
                setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
                return { success: true, data: newExpense };
            }

            return { success: false, message: "Failed to add expense" };
        } catch (err) {
            console.error("Failed to add expense:", err);
            const message = err.response?.data?.message || "Failed to add expense";
            setError(message);
            return { success: false, message };
        }
    };

    // Add a new expense with custom splits
    const addExpenseCustomSplit = async (expenseData) => {
        try {
            setError(null);
            const response = await api.post("/expenses", expenseData);

            if (response.data.success) {
                const newExpense = response.data.data;
                setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
                return { success: true, data: newExpense };
            }

            return { success: false, message: "Failed to add expense" };
        } catch (err) {
            console.error("Failed to add expense:", err);
            const message = err.response?.data?.message || "Failed to add expense";
            setError(message);
            return { success: false, message };
        }
    };

    // Delete an expense
    const deleteExpense = async (expenseId) => {
        try {
            setError(null);
            const response = await api.delete(`/expenses/${expenseId}`);

            if (response.data.success) {
                setExpenses((prevExpenses) =>
                    prevExpenses.filter((expense) => expense.id !== expenseId)
                );
                return { success: true };
            }

            return { success: false, message: "Failed to delete expense" };
        } catch (err) {
            console.error("Failed to delete expense:", err);
            const message = err.response?.data?.message || "Failed to delete expense";
            setError(message);
            return { success: false, message };
        }
    };

    // Clear expenses (when switching groups)
    const clearExpenses = () => {
        setExpenses([]);
        setError(null);
    };

    const value = {
        expenses,
        loading,
        error,
        fetchExpenses,
        addExpenseEqualSplit,
        addExpenseCustomSplit,
        deleteExpense,
        clearExpenses,
    };

    return (
        <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
    );
};

export default ExpenseContext;
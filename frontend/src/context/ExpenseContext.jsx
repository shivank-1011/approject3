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
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

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

    const fetchBalances = async (groupId) => {
        if (!isAuthenticated || !groupId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/expenses/balance/${groupId}`);

            if (response.data.success) {
                setBalances(response.data.data.transactions || []);
            }
        } catch (err) {
            console.error("Failed to fetch balances:", err);
            setError(err.response?.data?.message || "Failed to fetch balances");
            setBalances([]);
        } finally {
            setLoading(false);
        }
    };

    const addExpenseEqualSplit = async (expenseData) => {
        try {
            setError(null);
            const response = await api.post("/expenses/equal", expenseData);

            if (response.data.success) {
                const newExpense = response.data.data;
                setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);

                if (expenseData.groupId) {
                    await fetchBalances(expenseData.groupId);
                }

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

    const addExpenseCustomSplit = async (expenseData) => {
        try {
            setError(null);
            const response = await api.post("/expenses", expenseData);

            if (response.data.success) {
                const newExpense = response.data.data;
                setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);

                if (expenseData.groupId) {
                    await fetchBalances(expenseData.groupId);
                }

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

    const deleteExpense = async (expenseId, groupId) => {
        try {
            setError(null);
            const response = await api.delete(`/expenses/${expenseId}`);

            if (response.data.success) {
                setExpenses((prevExpenses) =>
                    prevExpenses.filter((expense) => expense.id !== expenseId)
                );

                if (groupId) {
                    await fetchBalances(groupId);
                }

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

    const clearExpenses = () => {
        setExpenses([]);
        setBalances([]);
        setError(null);
    };

    const value = {
        expenses,
        balances,
        loading,
        error,
        fetchExpenses,
        fetchBalances,
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
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth token
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token and fetch user data
            // Implementation depends on your backend
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Implement login logic
    };

    const register = async (email, password, name) => {
        // Implement registration logic
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

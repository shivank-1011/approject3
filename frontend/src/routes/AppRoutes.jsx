import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard';
import Groups from '../pages/Groups';
import Expenses from '../pages/Expenses';
import Settlements from '../pages/Settlements';
import Analytics from '../pages/Analytics';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
                <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
                <Route path="/settlements" element={<PrivateRoute><Settlements /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default AppRoutes;

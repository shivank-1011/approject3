import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GroupProvider } from './context/GroupContext';
import { ExpenseProvider } from './context/ExpenseContext';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';

function App() {
    return (
        <AuthProvider>
            <GroupProvider>
                <ExpenseProvider>
                    <AppRoutes />
                </ExpenseProvider>
            </GroupProvider>
        </AuthProvider>
    );
}

export default App;

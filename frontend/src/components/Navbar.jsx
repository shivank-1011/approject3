import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Expense Splitter</Link>
            </div>
            <ul className="navbar-menu">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/groups">Groups</Link></li>
                <li><Link to="/expenses">Expenses</Link></li>
                <li><Link to="/settlements">Settlements</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;

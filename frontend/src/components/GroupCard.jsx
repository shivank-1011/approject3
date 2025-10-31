import React from 'react';

const GroupCard = ({ group }) => {
    return (
        <div className="group-card">
            <h3>{group.name}</h3>
            <p>Members: {group.members?.length || 0}</p>
            <p>Total Expenses: ${group.totalExpenses || 0}</p>
        </div>
    );
};

export default GroupCard;

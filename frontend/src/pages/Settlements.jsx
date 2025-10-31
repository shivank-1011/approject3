import React, { useEffect, useState } from 'react';

const Settlements = () => {
    const [settlements, setSettlements] = useState([]);

    useEffect(() => {
        // Fetch settlements data
    }, []);

    return (
        <div className="settlements-page">
            <h1>Settlements</h1>
            <div className="settlements-list">
                {settlements.map((settlement, index) => (
                    <div key={index} className="settlement-item">
                        <p>{settlement.from} owes {settlement.to}</p>
                        <p className="amount">${settlement.amount.toFixed(2)}</p>
                        <button>Settle Up</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settlements;

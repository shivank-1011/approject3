import React from 'react';

const BalanceChart = ({ balances }) => {
    return (
        <div className="balance-chart">
            <h3>Balance Overview</h3>
            {balances?.map((balance, index) => (
                <div key={index} className="balance-item">
                    <span>{balance.user}</span>
                    <span className={balance.amount >= 0 ? 'positive' : 'negative'}>
                        ${Math.abs(balance.amount).toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default BalanceChart;

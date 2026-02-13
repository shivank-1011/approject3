import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AnimatedIcon from "./AnimatedIcon";
import chartAnimation from "../assets/animations/chart.json";
import moneyAnimation from "../assets/animations/money.json";
import checkAnimation from "../assets/animations/success.json";
import warningAnimation from "../assets/animations/warning.json";

export default function BalanceChart({
  balances,
  currentUserId,
  groupName,
  contributionData = [],
  trendData = [],
  totalExpense = 0,
  userPaid = 0,
  netBalance = 0,
}) {
  const summary = useMemo(() => {
    if (!balances || balances.length === 0) {
      return {
        youOwe: 0,
        owedToYou: 0,
        netBalance: netBalance,
        totalTransactions: 0,
      };
    }

    let youOwe = 0;
    let owedToYou = 0;
    let totalTransactions = balances.length;

    balances.forEach((balance) => {
      if (balance.debtorId === currentUserId) {
        youOwe += balance.amount;
      }
      if (balance.creditorId === currentUserId) {
        owedToYou += balance.amount;
      }
    });

    const calculatedNetBalance = owedToYou - youOwe;

    return {
      youOwe,
      owedToYou,
      netBalance: calculatedNetBalance,
      totalTransactions,
    };
  }, [balances, currentUserId, netBalance]);

  const chartData = useMemo(() => {
    const maxAmount = Math.max(
      summary.youOwe,
      summary.owedToYou,
      1 // Minimum 1 to avoid division by zero
    );

    return {
      youOwePercentage: (summary.youOwe / maxAmount) * 100,
      owedToYouPercentage: (summary.owedToYou / maxAmount) * 100,
      maxAmount,
    };
  }, [summary]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontWeight="bold"
        fontSize="14"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">₹{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="balance-chart-container">
      <div className="chart-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <AnimatedIcon animationData={chartAnimation} width="32px" height="32px" />
          <h2>Spending Visualization</h2>
        </div>
        {groupName && <p className="chart-subtitle">{groupName}</p>}
      </div>

      {/* Contribution Pie Chart */}
      {contributionData && contributionData.length > 0 && (
        <div className="chart-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <AnimatedIcon animationData={moneyAnimation} width="24px" height="24px" />
            <h3 className="chart-section-title" style={{ margin: 0 }}>Contribution Share</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={contributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {contributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry) => `${value} (₹${entry.payload.value.toFixed(2)})`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expense Trend Bar Chart */}
      {trendData && trendData.length > 0 && (
        <div className="chart-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <AnimatedIcon animationData={chartAnimation} width="24px" height="24px" />
            <h3 className="chart-section-title" style={{ margin: 0 }}>Expense Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="amount"
                fill="#3498db"
                name="Total Amount"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Cards (for settlements page) */}
      {balances && balances.length > 0 && (
        <div className="balance-summary">
          <div className="summary-card summary-owe">
            <div className="summary-icon">
              <AnimatedIcon animationData={moneyAnimation} width="40px" height="40px" />
            </div>
            <div className="summary-content">
              <div className="summary-label">You Owe</div>
              <div className="summary-value owe-amount">₹{summary.youOwe.toFixed(2)}</div>
            </div>
          </div>

          <div className="summary-card summary-owed">
            <div className="summary-icon">
              <AnimatedIcon animationData={moneyAnimation} width="40px" height="40px" />
            </div>
            <div className="summary-content">
              <div className="summary-label">Owed to You</div>
              <div className="summary-value owed-amount">₹{summary.owedToYou.toFixed(2)}</div>
            </div>
          </div>

          <div className={`summary-card summary-net ${summary.netBalance >= 0 ? 'positive' : 'negative'}`}>
            <div className="summary-icon">
              <AnimatedIcon animationData={summary.netBalance >= 0 ? checkAnimation : warningAnimation} width="40px" height="40px" />
            </div>
            <div className="summary-content">
              <div className="summary-label">Net Balance</div>
              <div className={`summary-value net-amount ${summary.netBalance >= 0 ? 'positive' : 'negative'}`}>
                {summary.netBalance >= 0 ? '+' : ''}₹{summary.netBalance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bar Chart Visualization (for settlements page) */}
      {balances && balances.length > 0 && summary.totalTransactions > 0 && (
        <div className="chart-visualization">
          <h3 className="chart-title">Balance Comparison</h3>
          <div className="bar-chart">
            <div className="bar-item">
              <div className="bar-label">You Owe</div>
              <div className="bar-container">
                <div
                  className="bar-fill owe-bar"
                  style={{ width: `${chartData.youOwePercentage}%` }}
                >
                  <span className="bar-value">₹{summary.youOwe.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label">Owed to You</div>
              <div className="bar-container">
                <div
                  className="bar-fill owed-bar"
                  style={{ width: `${chartData.owedToYouPercentage}%` }}
                >
                  <span className="bar-value">₹{summary.owedToYou.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Count (for settlements page) */}
      {balances && balances.length > 0 && (
        <div className="chart-footer">
          <div className="transaction-count">
            <span className="count-icon"></span>
            <span className="count-text">
              {summary.totalTransactions} {summary.totalTransactions === 1 ? 'transaction' : 'transactions'} to settle
            </span>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .balance-chart-container {
          background: white;
          padding: 5rem;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .chart-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .chart-header h2 {
          font-size: 1.75rem;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .chart-subtitle {
          color: #7f8c8d;
          font-size: 0.95rem;
          margin: 0;
        }

        .chart-section {
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e1e8ed;
        }

        .chart-section-title {
          font-size: 1.2rem;
          color: #2c3e50;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          text-align: center;
        }

        .custom-tooltip {
          background: rgba(0, 0, 0, 0.8);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: none;
        }

        .tooltip-label {
          color: white;
          font-size: 0.9rem;
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }

        .tooltip-value {
          color: #4fc3f7;
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        .balance-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .summary-owe {
          background: linear-gradient(135deg, #ffe5e5 0%, #ffcccc 100%);
          border: 2px solid #ffb3b3;
        }

        .summary-owed {
          background: linear-gradient(135deg, #e5f8e5 0%, #ccf0cc 100%);
          border: 2px solid #b3e6b3;
        }

        .summary-net.positive {
          background: linear-gradient(135deg, #e5f8e5 0%, #ccf0cc 100%);
          border: 2px solid #66d466;
        }

        .summary-net.negative {
          background: linear-gradient(135deg, #ffe5e5 0%, #ffcccc 100%);
          border: 2px solid #ff6666;
        }

        .summary-icon {
          font-size: 2.5rem;
          line-height: 1;
        }

        .summary-content {
          flex: 1;
        }

        .summary-label {
          font-size: 0.85rem;
          color: #5a5a5a;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .owe-amount {
          color: #e74c3c;
        }

        .owed-amount {
          color: #27ae60;
        }

        .net-amount.positive {
          color: #27ae60;
        }

        .net-amount.negative {
          color: #e74c3c;
        }

        .chart-visualization {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e1e8ed;
        }

        .chart-title {
          font-size: 1.1rem;
          color: #2c3e50;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
        }

        .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .bar-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .bar-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .bar-container {
          width: 100%;
          height: 45px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e1e8ed;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 1rem;
          transition: width 0.5s ease;
          position: relative;
          min-width: 80px;
        }

        .owe-bar {
          background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
        }

        .owed-bar {
          background: linear-gradient(90deg, #27ae60 0%, #229954 100%);
        }

        .bar-value {
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .chart-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e1e8ed;
        }

        .transaction-count {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #7f8c8d;
          font-size: 1rem;
          font-weight: 600;
        }

        .count-icon {
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .balance-chart-container {
            padding: 1.5rem;
          }

          .chart-header h2 {
            font-size: 1.5rem;
          }

          .balance-summary {
            grid-template-columns: 1fr;
          }

          .summary-card {
            padding: 1rem;
          }

          .summary-icon {
            font-size: 2rem;
          }

          .summary-value {
            font-size: 1.3rem;
          }

          .bar-fill {
            min-width: 60px;
            padding-right: 0.5rem;
          }

          .bar-value {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .balance-chart-container {
            padding: 1.25rem;
          }

          .chart-header h2 {
            font-size: 1.3rem;
          }

          .chart-subtitle {
            font-size: 0.85rem;
          }

          .summary-card {
            flex-direction: row;
            gap: 0.75rem;
          }

          .summary-icon {
            font-size: 1.75rem;
          }

          .summary-label {
            font-size: 0.75rem;
          }

          .summary-value {
            font-size: 1.2rem;
          }

          .chart-visualization {
            padding: 1rem;
          }

          .transaction-count {
            flex-direction: column;
            gap: 0.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
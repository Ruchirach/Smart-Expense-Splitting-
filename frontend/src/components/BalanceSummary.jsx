import React from 'react';

function BalanceSummary({ balances }) {
  const entries = Object.entries(balances || {});

  if (entries.length === 0) {
    return <p>No balances yet. Add some expenses first.</p>;
  }

  return (
    <div className="balance-list">
      {entries.map(([name, value]) => {
        const isPositive = value > 0;
        const isZero = Math.abs(value) < 0.01;
        return (
          <div
            key={name}
            className={`balance-item ${isPositive ? 'positive' : ''} ${
              !isPositive && !isZero ? 'negative' : ''
            }`}
          >
            <span className="balance-name">{name}</span>
            <span className="balance-value">
              {isZero
                ? 'is settled up'
                : isPositive
                ? `should receive  ₹${value.toFixed(2)}`
                : `owes  ₹${Math.abs(value).toFixed(2)}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default BalanceSummary;


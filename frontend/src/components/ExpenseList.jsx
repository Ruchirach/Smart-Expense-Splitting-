import React from 'react';

function ExpenseList({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses yet. Add one above!</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Paid By</th>
          <th>Split Between</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp.id}>
            <td>{exp.description}</td>
            <td> ₹{exp.amount.toFixed ? exp.amount.toFixed(2) : exp.amount}</td>
            <td>{exp.paidBy}</td>
            <td>{exp.splitBetween}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExpenseList;


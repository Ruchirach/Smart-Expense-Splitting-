import React, { useState } from 'react';

/**
 * Simple form to add an expense.
 * It sends a POST request to the backend when submitted.
 */
function AddExpenseForm({ apiBase, token, onExpenseAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitBetween, setSplitBetween] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description || !amount || !paidBy || !splitBetween) {
      setError('Please fill in all fields.');
      return;
    }

    const expense = {
      description,
      amount: parseFloat(amount),
      paidBy,
      splitBetween
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${apiBase}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please log in again.');
        }
        const text = await res.text();
        throw new Error(text || 'Failed to add expense');
      }

      setDescription('');
      setAmount('');
      setPaidBy('');
      setSplitBetween('');
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=" "
        />
      </div>

      <div className="form-row">
        <label>Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder=""
        />
      </div>

      <div className="form-row">
        <label>Paid By</label>
        <input
          type="text"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          placeholder=""
        />
      </div>

      <div className="form-row">
        <label>Split Between</label>
        <input
          type="text"
          value={splitBetween}
          onChange={(e) => setSplitBetween(e.target.value)}
          placeholder=''
        />
        <small>Each person will pay an equal share.</small>
      </div>

      {error && <div className="form-error">{error}</div>}

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
}

export default AddExpenseForm;


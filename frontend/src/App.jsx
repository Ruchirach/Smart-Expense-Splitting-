import React, { useEffect, useState } from 'react';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceSummary from './components/BalanceSummary';
import AuthForm from './components/AuthForm';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('userName') || ''
  );
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const fetchExpenses = async () => {
    try {
      setLoadingExpenses(true);
      setError(null);
      const res = await fetch(`${API_BASE}/expenses`, {
        headers: authHeaders
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Your session expired. Please log in again.');
        }
        throw new Error('Failed to fetch expenses');
      }
      const data = await res.json();
      setExpenses(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const fetchBalances = async () => {
    try {
      setLoadingBalances(true);
      setError(null);
      const res = await fetch(`${API_BASE}/expenses/balances`, {
        headers: authHeaders
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Your session expired. Please log in again.');
        }
        throw new Error('Failed to fetch balances');
      }
      const data = await res.json();
      setBalances(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingBalances(false);
    }
  };

  const fetchCurrentUser = async () => {
   if (!token) {
  return <Login />;
}

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: authHeaders
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      if (data?.name) {
        setCurrentUser(data.name);
        localStorage.setItem('userName', data.name);
      }
      if (data?.email) {
        localStorage.setItem('userEmail', data.email);
      }
    } catch (e) {
      // Keep UI usable even if this optional profile call fails.
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchExpenses();
      fetchBalances();
    }
  }, [token]);

  const handleExpenseAdded = () => {
    fetchExpenses();
    fetchBalances();
  };

  const handleAuthSuccess = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('userName', authData.name);
    localStorage.setItem('userEmail', authData.email);
    setToken(authData.token);
    setCurrentUser(authData.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setToken(null);
    setCurrentUser('');
    setExpenses([]);
    setBalances({});
  };

 

  return (
    <div className="app-container">
      <header className="app-header">z
        <div className="header-top">
          <span className="user-pill">
            {currentUser || 'Loading...'}
          </span>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1>Smart Expense Splitter</h1>
        <p>Track shared expenses and see who owes whom.</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Add Expense</h2>
          <AddExpenseForm
            apiBase={API_BASE}
            token={token}
            onExpenseAdded={handleExpenseAdded}
          />
        </section>

        <section className="card">
          <h2>All Expenses</h2>
          {loadingExpenses ? (
            <p>Loading expenses...</p>
          ) : (
            <ExpenseList expenses={expenses} />
          )}
        </section>

        <section className="card">
          <h2>Balances</h2>
          {loadingBalances ? (
            <p>Calculating balances...</p>
          ) : (
            <BalanceSummary balances={balances} />
          )}
        </section>

        {error && <div className="error-banner">Error: {error}</div>}
      </main>

      <footer className="app-footer">
        <small>Backend: `http://localhost:8080` · Frontend: `http://localhost:3000`</small>
      </footer>
    </div>
  );
}

export default App;


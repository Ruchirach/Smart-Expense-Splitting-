import React, { useEffect, useState } from 'react';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceSummary from './components/BalanceSummary';
import AuthForm from './components/AuthForm';

// ✅ Correct API base (from Render .env)
const API_BASE = import.meta.env.VITE_API_URL;

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // ✅ Verify token with backend
  const verifyUser = async () => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: authHeaders
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setCurrentUser(data.name);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);

      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoadingExpenses(true);
      const res = await fetch(`${API_BASE}/expenses`, {
        headers: authHeaders
      });
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
      const res = await fetch(`${API_BASE}/expenses/balances`, {
        headers: authHeaders
      });
      const data = await res.json();
      setBalances(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingBalances(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
      fetchBalances();
    }
  }, [isAuthenticated]);

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
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setCurrentUser('');
    setExpenses([]);
    setBalances({});
    setIsAuthenticated(false);
  };

  // 🔥 Show login/register if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthForm
        apiBase={API_BASE}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <span className="user-pill">
            {currentUser || 'Loading...'}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <h1>Smart Expense Splitter</h1>
      </header>

      <main>
        <AddExpenseForm
          apiBase={API_BASE}
          token={token}
          onExpenseAdded={handleExpenseAdded}
        />
        <ExpenseList expenses={expenses} />
        <BalanceSummary balances={balances} />
        {error && <p>{error}</p>}
      </main>
    </div>
  );
}

export default App;
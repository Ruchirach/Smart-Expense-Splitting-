import React, { useState } from 'react';

function AuthForm({ apiBase, onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      setSubmitting(true);
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Authentication failed');
      }

      const data = await res.json();
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="auth-tabs">
        <button
          className={`tab-button ${isLogin ? 'active' : ''}`}
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          type="button"
        >
          Login
        </button>
        <button
          className={`tab-button ${!isLogin ? 'active' : ''}`}
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          type="button"
        >
          Register
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-row">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        )}

        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting
            ? isLogin
              ? 'Logging in...'
              : 'Registering...'
            : isLogin
            ? 'Login'
            : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;


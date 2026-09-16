import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setFormError(res.error || 'Invalid credentials');
    }
  };

  return (
    <main className="auth-page page-container container">
      <div className="auth-form-container glass-panel">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your ShoeX account to continue</p>
        </div>

        {(error || formError) && (
          <div className="auth-error">
            {formError || error}
          </div>
        )}

        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address or Phone Number</label>
            <input
              type="text"
              id="email"
              placeholder="Email or +91 98765 43210"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-block auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>New to ShoeX? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Create an account</Link></p>
        </div>
      </div>
    </main>
  );
};

export default Login;

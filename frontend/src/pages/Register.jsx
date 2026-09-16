import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!firstName || !lastName || !password) {
      setMessage('Please fill in all required fields');
      return;
    }

    if (!email && !phone) {
      setMessage('Please provide either a Phone Number or an Email');
      return;
    }

    const res = await register({ firstName, lastName, phone, email, password });
    if (res.success) {
      // Navigate to login page so the user can log in first!
      navigate(redirect && redirect !== '/' ? `/login?redirect=${redirect}` : '/login');
    } else {
      setMessage(res.error || 'Registration failed');
    }
  };

  return (
    <main className="auth-page page-container container">
      <div className="auth-form-container glass-panel">
        <div className="auth-header">
          <h1>Join ShoeX</h1>
          <p>Create an account to track orders and save your favorites</p>
        </div>

        {(error || message) && (
          <div className="auth-error">
            {message || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                placeholder="John" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder="Doe" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              placeholder="+91 98765 43210" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address (Optional)</label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn btn-block auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in here</Link></p>
        </div>
      </div>
    </main>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [identifier, setIdentifier] = useState('');

  const { sendOTP, verifyOTPAndRegister, loading, error, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSendOtp = async (e) => {
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
      setMessage('Please provide either an email or phone number');
      return;
    }

    const res = await sendOTP({ firstName, lastName, email, phone, password });
    if (res.success) {
      setIdentifier(res.identifier);
      setStep(2);
      // For demo purposes, we automatically show the mock OTP in an alert/toast
      showToast(`[DEMO] Your OTP is: ${res.mockOtp}`, 'info');
    } else {
      setMessage(res.error || 'Failed to send verification code');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!otp) {
      setMessage('Please enter the 6-digit code');
      return;
    }

    const res = await verifyOTPAndRegister(identifier, otp);
    if (!res.success) {
      setMessage(res.error || 'Verification failed');
    }
  };

  return (
    <main className="auth-page page-container container">
      <div className="auth-form-container glass-panel">
        
        {step === 1 && (
          <>
            <div className="auth-header">
              <h1>Join ShoeX</h1>
              <p>Create an account to track orders and save your favorites</p>
            </div>

            {(error || message) && (
              <div className="auth-error">
                {message || error}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Required)</label>
                <input type="tel" id="phone" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (Optional)</label>
                <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-block auth-btn" disabled={loading}>
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in here</Link></p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-header">
              <h1>Verify Account</h1>
              <p>We've sent a 6-digit code to <strong>{identifier}</strong></p>
            </div>

            {(error || message) && (
              <div className="auth-error">
                {message || error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">6-Digit Code</label>
                <input 
                  type="text" 
                  id="otp" 
                  placeholder="123456" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  maxLength={6}
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '5px' }}
                />
              </div>

              <button type="submit" className="btn btn-block auth-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
              
              <div className="auth-footer" style={{ marginTop: '15px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                  Back to Registration
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default Register;

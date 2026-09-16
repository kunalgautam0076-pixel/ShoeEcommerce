import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

export const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const userInfo = localStorage.getItem('shoe-x-user');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem('shoe-x-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shoe-x-user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      setLoading(false);
      showToast(`Welcome back, ${data.firstName}!`, 'success');
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const sendOTP = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Backend server is not running on port 5000.');
      }
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setLoading(false);
      showToast(data.message, 'success');
      return { success: true, identifier: data.identifier, mockOtp: data.mockOtp };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const verifyOTPAndRegister = async (identifier, otp) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Backend server error.');
      }
      
      if (!res.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      setUser(data);
      setLoading(false);
      showToast('Registration successful! Welcome to ShoeX.', 'success');
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      sendOTP,
      verifyOTPAndRegister,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

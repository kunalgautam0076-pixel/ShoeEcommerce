import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-container container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  // If not authenticated, redirect to login page and save the attempted URL
  return isAuthenticated ? <Outlet /> : <Navigate to={`/login?redirect=${location.pathname}`} replace />;
};

export default ProtectedRoute;

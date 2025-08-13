import React from 'react';
import { Navigate } from 'react-router-dom';
import secureStorage from './utils/secureStorage';

const ProtectedRoute = ({ allowedRoles, children }) => {
  // Use secure storage instead of localStorage
  const userType = secureStorage.getUserType();
  const isAuthenticated = secureStorage.isAuthenticated();
  
  // Check if user is authenticated and has valid token
  if (!isAuthenticated || !userType) {
    // Clear any invalid data and redirect to login
    secureStorage.clearAll();
    return <Navigate to="/" replace />;
  }
  
  // Check if user has required role
  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

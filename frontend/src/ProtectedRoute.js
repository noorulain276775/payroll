import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserType } from './store/slices/authSlice';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);

  // Check if user is authenticated and has valid token
  if (!isAuthenticated || !userType) {
    return <Navigate to="/" replace />;
  }
  
  // Check if user has required role
  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

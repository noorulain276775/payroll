import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import routes from '../routes';
import ProtectedRoute from '../ProtectedRoute';
import { selectUserType, selectIsAuthenticated } from '../store/slices/authSlice';
import AIChatbot from '../components/AIChatbot';

const DefaultLayout = () => {
  const userType = useSelector(selectUserType);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect to login if user is not authenticated
  if (!isAuthenticated || !userType) {
    return <Navigate to="/" />;
  }

  return (
    <div className="c-app">
      {/* Show different sidebars based on user role */}
      <AppSidebar userType={userType} />
      
      <div className="c-wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="c-body flex-grow-1 px-3">
          <Routes>
            {routes.map((route, idx) => {
              return route.element ? (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    <ProtectedRoute allowedRoles={route.allowedRoles}>
                      <route.element />
                    </ProtectedRoute>
                  }
                />
              ) : null;
            })}
          </Routes>
        </div>
        <AppFooter />
      </div>
      
      {/* AI Chatbot - Available for all authenticated users */}
      <AIChatbot />
    </div>
  );
};

export default DefaultLayout;

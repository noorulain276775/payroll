import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import routes from '../routes';
import ProtectedRoute from '../ProtectedRoute';

const DefaultLayout = () => {
  const userType = localStorage.getItem('user_type');

  // Redirect to login if user is not authenticated
  if (!userType) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {/* Show different sidebars based on user role */}
      <AppSidebar userType={userType} />
      
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1" style={{width: '98%', margin: 'auto'}}>
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
    </div>
  );
};

export default DefaultLayout;

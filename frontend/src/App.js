import React, { Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUserType, initializeAuth } from './store/slices/authSlice';
import ErrorBoundary from './components/ErrorBoundary';
import './scss/style.scss';
import './scss/examples.scss';

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);
  const initializedRef = useRef(false);

  // Initialize auth state from storage on app start - only once
  useEffect(() => {
    if (!initializedRef.current) {
      dispatch(initializeAuth());
      initializedRef.current = true;
    }
  }, [dispatch]);

  // Determine redirect path based on user type
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/';
    // Employee users go to employee dashboard, Admin and Both users go to admin dashboard
    if (userType === 'Employee') {
      return '/employee-dashboard';
    } else {
      // Admin, Both, and any other admin-like roles go to admin dashboard
      return '/dashboard';
    }
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to={getRedirectPath()} /> : <Login />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
            {isAuthenticated && <Route path="*" element={<DefaultLayout />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;

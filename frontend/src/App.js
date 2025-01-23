import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import './scss/examples.scss';


const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (!isColorModeSet()) {
      setColorMode('light');
    }
  }, []);
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/" name="Login Page" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

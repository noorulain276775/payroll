import React from 'react';
import { useSelector } from 'react-redux';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { selectUserType } from '../store/slices/authSlice';
import AIChatbot from '../components/AIChatbot';

const DefaultLayout = () => {
  const userType = useSelector(selectUserType);

  return (
    <div className="c-app">
      {/* Show different sidebars based on user role */}
      <AppSidebar userType={userType} />
      
      <div className="c-wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="c-body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      
      {/* AI Chatbot - Available for all authenticated users */}
      <AIChatbot />
    </div>
  );
};

export default DefaultLayout;

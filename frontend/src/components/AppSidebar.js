import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { 
  cilHome,
  cilUser,
  cilPeople,
  cilCalendar,
  cilMoney,
  cilChart,
  cilSettings,
  cilTask,
  cilThumbUp,
  cilBarChart,
  cilX,
  cilMenu
} from '@coreui/icons';

import { setSidebarShow, setSidebarUnfoldable } from '../store/slices/uiSlice';
import { selectUserType } from '../store/slices/authSlice';
import getNavigation from '../_nav';

import logo from 'src/assets/brand/logo.png';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const userType = useSelector(selectUserType);

  const navigation = getNavigation(userType);

  // Safety check - if navigation is invalid, don't render
  if (!navigation || !Array.isArray(navigation) || navigation.length === 0) {
    return null;
  }

  const handleSidebarToggle = () => {
    dispatch(setSidebarShow(!sidebarShow));
  };

  const handleUnfoldableToggle = () => {
    dispatch(setSidebarUnfoldable(!unfoldable));
  };

  const renderNavItem = (item, index) => {
    if (item.component && item.component.name === 'CNavTitle') {
      return (
        <div key={index} className="sidebar-title">
          {item.name}
        </div>
      );
    }

    if (item.component && item.component.name === 'CNavGroup') {
      return (
        <div key={index} className="sidebar-group">
          <div className="sidebar-group-header">
            {item.icon && item.icon}
            <span>{item.name}</span>
          </div>
          <div className="sidebar-group-items">
            {item.items && item.items.map((subItem, subIndex) => (
              <NavLink
                key={subIndex}
                to={subItem.to}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span>{subItem.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.to}
        className={({ isActive }) => 
          `sidebar-link ${isActive ? 'active' : ''}`
        }
      >
        {item.icon && item.icon}
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarShow && (
        <div 
          className="sidebar-overlay"
          onClick={handleSidebarToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarShow ? 'show' : ''} ${unfoldable ? 'unfoldable' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img
              src={logo}
              alt="Logo"
              className="sidebar-logo"
            />
          </div>
          <button
            className="sidebar-close"
            onClick={handleSidebarToggle}
          >
            <CIcon icon={cilX} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigation.map((item, index) => renderNavItem(item, index))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-toggle"
            onClick={handleUnfoldableToggle}
          >
            <CIcon icon={cilMenu} />
          </button>
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        className="sidebar-mobile-toggle"
        onClick={handleSidebarToggle}
      >
        <CIcon icon={cilMenu} />
      </button>
    </>
  );
};

export default React.memo(AppSidebar);

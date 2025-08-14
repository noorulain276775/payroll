import React from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilAccountLogout, cilUser, cilReload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { selectUser, selectIsAuthenticated } from '../../store/slices/authSlice';

import avatar8 from './../../assets/images/avatars/8.jpg';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = async () => {
    try {
      // Dispatch logout action
      await dispatch(logoutUser());
      // Redux will handle clearing localStorage and redirecting
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      navigate('/');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {user && (
          <CDropdownItem header="true" className="text-center">
            <strong>{user.username}</strong>
            <br />
            <small className="text-muted">{user.user_type}</small>
          </CDropdownItem>
        )}
        <CDropdownItem divider="true" />
        <CDropdownItem onClick={handleProfile}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={handleSettings}>
          <CIcon icon={cilReload} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem divider="true" />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Sign out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;

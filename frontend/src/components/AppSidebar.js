import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';
import getNavigation from '../_nav';
import { setSidebarShow, setSidebarUnfoldable } from '../store/slices/uiSlice';

import logo from 'src/assets/brand/logo.png';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);

  const navigation = getNavigation();

  const handleSidebarToggle = () => {
    dispatch(setSidebarShow(!sidebarShow));
  };

  const handleUnfoldableToggle = () => {
    dispatch(setSidebarUnfoldable(!unfoldable));
  };

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible));
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          to="/"
          className="d-flex align-items-center justify-content-center w-100"
          style={{ height: '100px' }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '60px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={handleSidebarToggle}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={handleUnfoldableToggle}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);

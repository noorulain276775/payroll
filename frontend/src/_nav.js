import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilAddressBook,
  cilMoney,
  cilWallet,
  cilUserPlus,
  cilFile,
  cilUser,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

// Navigation for Admin Users
const adminNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Liya Employees',
  },
  {
    component: CNavItem,
    name: 'Employees Information',
    to: '/employees',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Salary Details',
    to: '/employees/salary-details',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Payroll',
    to: '/employees/payroll',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Register',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'New User',
        to: '/register/new-user',
      },
      {
        component: CNavItem,
        name: 'New Employee',
        to: '/employees/add-employee',
      },
    ],
  },
];

// Navigation for Employee Users
const employeeNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/employee-dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Payslips',
    to: '/employee/payslips',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Profile',
    to: '/employee/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Salary details',
    to: '/employee/salary-details',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
];

const getNavigation = () => {
  const userType = localStorage.getItem('user_type');
  return userType === 'Admin' ? adminNav : employeeNav;
};

export default getNavigation;

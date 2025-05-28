import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilAddressBook,
  cilMoney,
  cilWallet,
  cilUserPlus,
  cilFile,
  cilCalendar,
  cilLockLocked,
  cilUser,
  cilTask,
  cilThumbUp,
  cilBarChart
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
    name: 'Payrolls',
    to: '/employees/payroll',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Salary Revision',
    to: '/employees/salary-revision',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Leave Requests',
    to: '/employees/leave-applications',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {

    component: CNavItem,
    name: 'Employees Leave Balances',
    to: '/employees/leave-balances',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Accounts',
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
      {
        component: CNavItem,
        name: 'Change Password',
        to: '/employee/change-password',
      },
    ],
  },
];


const bothNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Admin Settings',
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
    name: 'Payrolls',
    to: '/employees/payroll',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Salary Revision',
    to: '/employees/salary-revision',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Leave Requests',
    to: '/employees/leave-applications',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Leaves Summary',
    to: '/employees/leaves-summary',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {

    component: CNavItem,
    name: 'Employees Leave Balances',
    to: '/employees/leave-balances',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
    {
    component: CNavGroup,
    name: 'Accounts',
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
      {
        component: CNavItem,
        name: 'Change Password',
        to: '/employee/change-password',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Employee Settings',
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
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Payslips',
    to: '/employee/payslips',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Apply Leaves',
    to: '/employee/leave-applications',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Leave Requests',
    to: '/employee/leave-applications/history',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Leave Balances',
    to: '/employee/leave-balances',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Salary Revisions',
    to: '/employee/salary-revision',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
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
    name: 'My Profile',
    to: '/employee/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Salary details',
    to: '/employee/salary-details',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Payslips',
    to: '/employee/payslips',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Apply Leaves',
    to: '/employee/leave-applications',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Leave Requests',
    to: '/employee/leave-applications/history',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Leave Balances',
    to: '/employee/leave-balances',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Salary Revisions',
    to: '/employee/salary-revision',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Change Password',
    to: '/employee/change-password',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
  },
];

const getNavigation = () => {
  const userType = localStorage.getItem('user_type');

  switch (userType) {
    case 'Admin':
      return adminNav;
    case 'Both':
      return bothNav;
    case 'Employee':
    default:
      return employeeNav;
  }
};



export default getNavigation;

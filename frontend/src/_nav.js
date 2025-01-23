import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilAddressBook,
  cilMoney,
  cilIndustry,
  cilWallet,
  cilUserPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
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
    name: 'Personal Information',
    to: '/employees',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Salary Details',
    to: '/employees/salary-details',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Company Data',
  //   to: '/employees/company-data',
  //   icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />,
  // },
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
      // {
      //   component: CNavItem,
      //   name: 'New User',
      //   to: '/register',
      // },
      {
        component: CNavItem,
        name: 'New User',
        to: '/admin-register',
      },
      {
        component: CNavItem,
        name: 'New Employee',
        to: '/employees/add-employee',
      },
    ],
  },
]

export default _nav

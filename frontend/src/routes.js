import { element } from 'prop-types';
import React from 'react';

// Common Pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

// Employees
const Employees = React.lazy(() => import('./views/Employees/Employees'));

// Salary
const Salary = React.lazy(() => import('./views/Salary/Salary'));

// Company Data
const CompanyData = React.lazy(() => import('./views/CompanyData/CompanyData'));

// Payroll
const Payroll = React.lazy(() => import('./views/Payroll/Payroll'));

// Add Employee (Admin Only)
const AddEmployee = React.lazy(() => import('./views/Employees/AddEmployee'));

// Add User (Admin Only)
const AddUser = React.lazy(() => import('./views/Employees/AddUser'));

// Employee Dashboard
const EmployeeDashboard = React.lazy(() => import('./views/dashboard/EmployeeDashboard'));

// Employee Payslips
const EmployeePayslips = React.lazy(() => import('./views/Payslips/EmployeePayslips'))

// Employee Profile
const EmployeeProfile = React.lazy(() => import('./views/Profile/EmployeeProfile'));

// Employee Profile
const EmployeeSalaryDetails = React.lazy(() => import('./views/Profile/EmployeeSalaryDetails'))

// Change Password
const ChangePassword = React.lazy(() => import('./views/ChangePassword/ChangePassword'))

// Salary Revisions
const SalaryRevisions = React.lazy(() => import('./views/Salary/SalaryRevisions'))
// Admin View Annual Leaves
const EmployeeAnnualLeaves = React.lazy(() => import('./views/AnnualLeaves/AdminAnnualLeaves'))

// Employee Annual Leaves
const AdminAnnualLeaves = React.lazy(() => import('./views/AnnualLeaves/EmployeeAnnualLeaves'))

const routes = [
  // Admin Routes
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, allowedRoles: ['Admin'] },
  { path: '/employees', name: 'Employees', element: Employees, allowedRoles: ['Admin'] },
  { path: '/employees/salary-details', name: 'Salary', element: Salary, allowedRoles: ['Admin'] },
  { path: '/employees/company-data', name: 'Company Data', element: CompanyData, allowedRoles: ['Admin'] },
  { path: '/employees/payroll', name: 'Payroll', element: Payroll, allowedRoles: ['Admin'] },
  { path: '/employees/add-employee', name: 'Add Employee', element: AddEmployee, allowedRoles: ['Admin'] },
  { path: '/register/new-user', name: 'Add Admin', element: AddUser, allowedRoles: ['Admin'] },
  { path: '/employees/salary-revision', name: 'Salary Revisions', element: SalaryRevisions, allowedRoles: ['Admin'] },
  { path: '/employees/leave-applications', name: 'Employees Annual Leaves', element: AdminAnnualLeaves, allowedRoles: ['Admin'] },

  // For both (Admin and Employee)
  { path: '/employee/change-password', name: 'Change Password', element: ChangePassword, allowedRoles: ['Admin', 'Employee'] },

  // Employee Routes
  { path: '/employee-dashboard', name: 'Employee Dashboard', element: EmployeeDashboard, allowedRoles: ['Employee'] },
  { path: '/employee/payslips', name: 'Employee Payslip', element: EmployeePayslips, allowedRoles: ['Employee'] },
  { path: '/employee/profile', name: 'Employee Profile', element: EmployeeProfile, allowedRoles: ['Employee'] },
  { path: '/employee/salary-details', name: 'Employee Salary', element: EmployeeSalaryDetails, allowedRoles: ['Employee'] },
  { path: '/employee/annual-leaves', name: 'Employee Annual Leaves', element: EmployeeAnnualLeaves, allowedRoles: ['Employee'] },
];

export default routes;

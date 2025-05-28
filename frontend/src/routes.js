import React from 'react';

// Common Pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

// Employees
const Employees = React.lazy(() => import('./views/Employees/Employees'));

// Salary
const Salary = React.lazy(() => import('./views/Salary/Salary'));


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
const EmployeeAnnualLeaves = React.lazy(() => import('./views/Leaves/EmployeeDashboard/EmployeeApplyLeaves'))

// Employee Annual Leaves
const AdminAnnualLeaves = React.lazy(() => import('./views/Leaves/AdminDashboard/ManageLeaveRequests'))

// Employee Leave Balances Creation for each leave type
const AdminCreatingLeaveBalances = React.lazy(() => import('./views/Leaves/AdminDashboard/EmployeeLeaveBalances'))

// Employee Leave Request History
const EmployeeLeavesRequests = React.lazy(() => import('./views/Leaves/EmployeeDashboard/EmployeeLeavesRequests'))

// Employee Salary Revisions
const EmployeeSalaryRevisions = React.lazy(() => import('./views/Salary/EmployeeSalaryRevisions'))

const EmployeeOwnLeaveBalance = React.lazy(() => import('./views/Leaves/EmployeeDashboard/EmployeeOwnLeaveBalance'))

const EmployeeLeavesSummary = React.lazy(() => import('./views/Leaves/AdminDashboard/EmployeeLeavesSummary'));

const AddEmployeeLeaves = React.lazy(() => import('./views/Leaves/AdminDashboard/AddEmployeeLeaves'));

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees', name: 'Employees', element: Employees, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/salary-details', name: 'Salary', element: Salary, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/payroll', name: 'Payroll', element: Payroll, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/add-employee', name: 'Add Employee', element: AddEmployee, allowedRoles: ['Admin' , 'Both'] },
  { path: '/register/new-user', name: 'Add Admin', element: AddUser, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/salary-revision', name: 'Salary Revisions', element: SalaryRevisions, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/leave-applications', name: 'Employees Annual Leaves', element: AdminAnnualLeaves, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/leave-balances', name: 'Leave Balances', element: AdminCreatingLeaveBalances, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/leaves-summary', name: 'Leave Summary', element: EmployeeLeavesSummary, allowedRoles: ['Admin' , 'Both'] },
  { path: '/employees/add-leave', name: 'Add Employee Leaves', element: AddEmployeeLeaves, allowedRoles: ['Admin' , 'Both'] },


  // For (Admin and Employee and Both)
  { path: '/employee/change-password', name: 'Change Password', element: ChangePassword, allowedRoles: ['Admin', 'Employee', 'Both'] },


  // Employee and Both Routes
  { path: '/employee-dashboard', name: 'Employee Dashboard', element: EmployeeDashboard, allowedRoles: ['Employee'] },
  { path: '/employee/payslips', name: 'Employee Payslip', element: EmployeePayslips, allowedRoles: ['Employee', 'Both'] },
  { path: '/employee/profile', name: 'Employee Profile', element: EmployeeProfile, allowedRoles: ['Employee', 'Both'] },
  { path: '/employee/salary-details', name: 'Employee Salary', element: EmployeeSalaryDetails, allowedRoles: ['Employee', 'Both'] },
  { path: '/employee/leave-applications', name: 'Employee Annual Leaves', element: EmployeeAnnualLeaves, allowedRoles: ['Employee', 'Both'] },
  { path: '/employee/leave-applications/history', name: 'Leave Requests', element: EmployeeLeavesRequests, allowedRoles: ['Employee', 'Both'] },
  { path: '/employee/salary-revision', name: 'Employee Salary Revisions', element: EmployeeSalaryRevisions, allowedRoles: ['Employee', 'Both'] },
  { path: '/employee/leave-balances', name: 'My Leave Balances', element: EmployeeOwnLeaveBalance, allowedRoles: ['Employee', 'Both'] },
];

export default routes;

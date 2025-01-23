import React from 'react'
import AddUser from './views/Employees/AddUser'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Employees
const Employees = React.lazy(() => import('./views/Employees/Employees'))

//Salary
const Salary = React.lazy(() => import('./views/Salary/Salary'))

// Company Data
const CompanyData = React.lazy(() => import('./views/CompanyData/CompanyData'))

// Payroll
const Payroll = React.lazy(() => import('./views/Payroll/Payroll'))

// Add Employee
const AddEmployee = React.lazy(() => import('./views/Employees/AddEmployee'))

// Add Admin
const AddAdmin = React.lazy(() => import('./views/Employees/AddUser'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/employees', name: 'Employees', element: Employees },
  { path: '/employees/salary-details', name: 'Salary', element: Salary },
  { path: '/employees/company-data', name: 'Company Data', element: CompanyData },
  { path: '/employees/payroll', name: 'Payroll', element: Payroll },
  { path: '/employees/add-employee', name: 'Add Employee', element: AddEmployee },
  { path: '/admin-register', name: 'Add Admin', element: AddUser },
]

export default routes

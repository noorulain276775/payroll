// Configuration file for the payroll application
// This file manages environment-specific settings

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Base URL configuration
export const BASE_URL = isProduction 
  ? 'https://your-production-domain.com/api'  // Replace with actual production URL
  : isDevelopment 
    ? 'http://localhost:8000/api'  // Django development server
    : 'http://localhost:8000/api'; // Default fallback

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/users/login/',
  LOGOUT: '/users/logout/',
  REGISTER: '/users/register/',
  CHANGE_PASSWORD: '/users/change-password/',
  REFRESH_TOKEN: '/users/refresh/',
  USERS_LIST: '/users/list/',
  
  // Employees
  EMPLOYEES: '/employees/view_all_employees/',
  CREATE_EMPLOYEE: '/employees/create_employee/',
  UPDATE_EMPLOYEE: '/employees/employee/',
  EMPLOYEE_PROFILE: '/employee/profile/',
  EMPLOYEE_UPDATE: '/employee/update/',
  
  // Salary
  SALARIES: '/employees/salaries/',
  CREATE_SALARY: '/employees/create-salary-details/',
  UPDATE_SALARY: '/employees/update-salary-details/',
  SALARY_REVISIONS: '/employees/salary-revision/',
  
  // Payroll
  PAYROLL: '/employees/view_all_payroll/',
  CREATE_PAYROLL: '/employees/create_payroll/',
  UPDATE_PAYROLL: '/employees/update-payroll-record/',
  SEND_SALARY_SLIP: '/employees/send_salary_slip/',
  
  // Leaves
  LEAVES: '/leaves/leaves/',
  LEAVE_BALANCES: '/leaves/leave-balances/',
  APPROVE_LEAVE: '/leaves/leaves/',
  REJECT_LEAVE: '/leaves/leaves/',
  EMPLOYEE_LEAVES: '/leaves/employee/leaves/',
  ADD_LEAVES: '/leaves/add-leaves/',
  LEAVE_SUMMARY: '/leaves/employees/leave-summary/',
  
  // Dashboard
  DASHBOARD_SUMMARY: '/employees/dashboard-summary/',
  NEW_EMPLOYEES: '/employees/new_employees/',
};

// File upload configuration
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  UPLOAD_ENDPOINTS: {
    PHOTO: '/upload/photo/',
    DOCUMENT: '/upload/document/',
  }
};

// Pagination configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Security configuration
export const SECURITY = {
  TOKEN_EXPIRY_WARNING: 5 * 60 * 1000, // 5 minutes before expiry
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// Feature flags
export const FEATURES = {
  ENABLE_LOGGING: isDevelopment,
  ENABLE_DEBUG: isDevelopment,
  ENABLE_ANALYTICS: isProduction,
};

// Logging configuration
export const LOGGING = {
  LEVEL: isDevelopment ? 'debug' : 'error',
  ENABLE_CONSOLE: isDevelopment,
  ENABLE_REMOTE: isProduction,
};

// Export default configuration
export default {
  BASE_URL,
  API_ENDPOINTS,
  FILE_CONFIG,
  PAGINATION,
  SECURITY,
  FEATURES,
  LOGGING,
  isDevelopment,
  isProduction,
};



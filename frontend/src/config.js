// Configuration file for the payroll application
// This file manages environment-specific settings

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Base URL configuration
export const BASE_URL = isProduction 
  ? 'https://your-production-domain.com/api'  // Replace with your actual production URL
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
  
  // Employees
  EMPLOYEES: '/view_all_employees/',
  CREATE_EMPLOYEE: '/create_employee/',
  UPDATE_EMPLOYEE: '/employee/',
  
  // Salary
  SALARIES: '/salaries/',
  CREATE_SALARY: '/create-salary-details/',
  UPDATE_SALARY: '/update-salary-details/',
  SALARY_REVISIONS: '/salary-revision/',
  
  // Payroll
  PAYROLL: '/view_all_payroll/',
  CREATE_PAYROLL: '/create_payroll/',
  UPDATE_PAYROLL: '/update-payroll-record/',
  SEND_SALARY_SLIP: '/send_salary_slip/',
  
  // Leaves
  LEAVES: '/leaves/',
  LEAVE_BALANCES: '/leave-balances/',
  APPROVE_LEAVE: '/leaves/',
  REJECT_LEAVE: '/leaves/',
  
  // Dashboard
  DASHBOARD_SUMMARY: '/dashboard-summary/',
  NEW_EMPLOYEES: '/new_employees/',
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



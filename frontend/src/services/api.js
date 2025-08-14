import axios from 'axios';
import { store } from '../store';
import { logoutUser, refreshToken } from '../store/slices/authSlice';
import { BASE_URL } from '../config';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const result = await store.dispatch(refreshToken());
        
        if (refreshToken.fulfilled.match(result)) {
          // Token refreshed, retry original request
          const newToken = store.getState().auth.token;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // Refresh failed, logout user
          store.dispatch(logoutUser());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/users/login/', credentials),
  logout: () => api.post('/users/logout/'),
  refresh: (refreshToken) => api.post('/users/refresh/', { refresh: refreshToken }),
  getCurrentUser: () => api.get('/users/user/'),
};

export const employeeAPI = {
  getAll: (params) => api.get('/employees/view_all_employees/', { params }),
  getById: (id) => api.get(`/employees/employee/${id}/`),
  create: (data) => api.post('/employees/create_employee/', data),
  update: (id, data) => api.put(`/employees/employee/${id}/`, data),
  delete: (id) => api.delete(`/employees/employee/${id}/`),
  getSalaryDetails: (id) => api.get(`/employees/salary-details/${id}/`),
};

export const leaveAPI = {
  getAll: (params) => api.get('/leaves/leaves/', { params }),
  getById: (id) => api.get(`/leaves/employee/leaves/${id}`),
  create: (data) => api.post('/leaves/leaves/', data),
  update: (id, data) => api.put(`/leaves/employee/leaves/${id}`, data),
  delete: (id) => api.delete(`/leaves/employee/leaves/${id}`),
  approve: (id, approverId) => api.post(`/leaves/leaves/${id}/approve/`, { approver: approverId }),
  reject: (id, approverId, remarks) => api.post(`/leaves/leaves/${id}/reject/`, { approver: approverId, remarks }),
  getBalances: (params) => api.get('/leaves/leave-balances/', { params }),
  getBalanceByEmployee: (id) => api.get(`/leaves/leave-balances/${id}/`),
  getEmployeeLeaves: () => api.get('/leaves/employee/leaves-requests/'),
  getApprovedLeaves: () => api.get('/leaves/employee/approve/leaves-requests/'),
  getLeaveSummary: () => api.get('/leaves/employees/leave-summary/'),
  createAdminLeave: (data) => api.post('/leaves/add-leaves/', data),
};

export const payrollAPI = {
  getAll: (params) => api.get('/employees/view_all_payroll/', { params }),
  getById: (id) => api.get(`/employees/view_all_payroll/${id}/`),
  create: (data) => api.post('/employees/create_payroll/', data),
  update: (id, data) => api.put(`/employees/update-payroll-record/${id}/`, data),
  delete: (id) => api.delete(`/employees/update-payroll-record/${id}/`),
};

export const dashboardAPI = {
  getSummary: () => api.get('/employees/dashboard-summary/'),
  getNewEmployees: () => api.get('/employees/new_employees/'),
  getMonthlyData: () => api.get('/monthly-data/'),
};

export default api;

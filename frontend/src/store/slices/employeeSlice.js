import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/employees/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employees'
      );
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/employees/${employeeId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employee'
      );
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${BASE_URL}/employees/`, employeeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create employee'
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ employeeId, employeeData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${BASE_URL}/employees/${employeeId}/`, employeeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update employee'
      );
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${BASE_URL}/employees/${employeeId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return employeeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete employee'
      );
    }
  }
);

export const fetchSalaryDetails = createAsyncThunk(
  'employees/fetchSalaryDetails',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/employees/${employeeId}/salary/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch salary details'
      );
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  salaryDetails: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  successMessage: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  },
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentEmployee: (state, action) => {
      state.currentEmployee = action.payload;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetEmployeeState: (state) => {
      state.employees = [];
      state.currentEmployee = null;
      state.salaryDetails = null;
      state.error = null;
      state.successMessage = null;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload.results || action.payload;
        if (action.payload.count !== undefined) {
          state.pagination.totalCount = action.payload.count;
          state.pagination.totalPages = Math.ceil(action.payload.count / state.pagination.pageSize);
        }
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEmployee = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isCreating = false;
        state.employees.unshift(action.payload);
        state.successMessage = 'Employee created successfully';
        state.error = null;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
        state.successMessage = 'Employee updated successfully';
        state.error = null;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        if (state.currentEmployee?.id === action.payload) {
          state.currentEmployee = null;
        }
        state.successMessage = 'Employee deleted successfully';
        state.error = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Fetch Salary Details
      .addCase(fetchSalaryDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalaryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salaryDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchSalaryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setCurrentEmployee,
  clearCurrentEmployee,
  setPagination,
  resetEmployeeState,
} = employeeSlice.actions;

// Selectors
export const selectEmployees = (state) => state.employees.employees;
export const selectCurrentEmployee = (state) => state.employees.currentEmployee;
export const selectSalaryDetails = (state) => state.employees.salaryDetails;
export const selectEmployeesLoading = (state) => state.employees.isLoading;
export const selectEmployeesCreating = (state) => state.employees.isCreating;
export const selectEmployeesUpdating = (state) => state.employees.isUpdating;
export const selectEmployeesDeleting = (state) => state.employees.isDeleting;
export const selectEmployeesError = (state) => state.employees.error;
export const selectEmployeesSuccessMessage = (state) => state.employees.successMessage;
export const selectEmployeesPagination = (state) => state.employees.pagination;

export default employeeSlice.reducer;

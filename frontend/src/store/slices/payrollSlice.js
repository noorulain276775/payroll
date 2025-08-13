import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';

export const fetchPayrollRecords = createAsyncThunk(
  'payroll/fetchPayrollRecords',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/payroll/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payroll records'
      );
    }
  }
);

export const fetchPayrollById = createAsyncThunk(
  'payroll/fetchPayrollById',
  async (payrollId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/payroll/${payrollId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payroll record'
      );
    }
  }
);

export const createPayrollRecord = createAsyncThunk(
  'payroll/createPayrollRecord',
  async (payrollData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${BASE_URL}/payroll/`, payrollData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create payroll record'
      );
    }
  }
);

const initialState = {
  payrollRecords: [],
  currentPayroll: null,
  isLoading: false,
  isCreating: false,
  error: null,
  successMessage: null,
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentPayroll: (state, action) => {
      state.currentPayroll = action.payload;
    },
    clearCurrentPayroll: (state) => {
      state.currentPayroll = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayrollRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payrollRecords = action.payload.results || action.payload;
        state.error = null;
      })
      .addCase(fetchPayrollRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPayrollById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayrollById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPayroll = action.payload;
        state.error = null;
      })
      .addCase(fetchPayrollById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPayrollRecord.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createPayrollRecord.fulfilled, (state, action) => {
        state.isCreating = false;
        state.payrollRecords.unshift(action.payload);
        state.successMessage = 'Payroll record created successfully';
        state.error = null;
      })
      .addCase(createPayrollRecord.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setCurrentPayroll,
  clearCurrentPayroll,
} = payrollSlice.actions;

// Selectors
export const selectPayrollRecords = (state) => state.payroll.payrollRecords;
export const selectCurrentPayroll = (state) => state.payroll.currentPayroll;
export const selectPayrollLoading = (state) => state.payroll.isLoading;
export const selectPayrollCreating = (state) => state.payroll.isCreating;
export const selectPayrollError = (state) => state.payroll.error;
export const selectPayrollSuccessMessage = (state) => state.payroll.successMessage;

export default payrollSlice.reducer;

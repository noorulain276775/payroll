import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';

// Async thunks
export const fetchLeaves = createAsyncThunk(
  'leaves/fetchLeaves',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/leaves/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leaves'
      );
    }
  }
);

export const fetchLeaveById = createAsyncThunk(
  'leaves/fetchLeaveById',
  async (leaveId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/leaves/${leaveId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leave'
      );
    }
  }
);

export const createLeave = createAsyncThunk(
  'leaves/createLeave',
  async (leaveData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${BASE_URL}/leaves/`, leaveData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create leave request'
      );
    }
  }
);

export const updateLeave = createAsyncThunk(
  'leaves/updateLeave',
  async ({ leaveId, leaveData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${BASE_URL}/leaves/${leaveId}/`, leaveData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update leave request'
      );
    }
  }
);

export const deleteLeave = createAsyncThunk(
  'leaves/deleteLeave',
  async (leaveId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${BASE_URL}/leaves/${leaveId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return leaveId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete leave request'
      );
    }
  }
);

export const approveLeave = createAsyncThunk(
  'leaves/approveLeave',
  async ({ leaveId, approverId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${BASE_URL}/leaves/${leaveId}/approve/`, {
        approver: approverId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve leave'
      );
    }
  }
);

export const rejectLeave = createAsyncThunk(
  'leaves/rejectLeave',
  async ({ leaveId, approverId, remarks }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${BASE_URL}/leaves/${leaveId}/reject/`, {
        approver: approverId,
        remarks: remarks || 'Leave request rejected'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject leave'
      );
    }
  }
);

export const fetchLeaveBalances = createAsyncThunk(
  'leaves/fetchLeaveBalances',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/leave-balances/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leave balances'
      );
    }
  }
);

export const fetchLeaveBalanceByEmployee = createAsyncThunk(
  'leaves/fetchLeaveBalanceByEmployee',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/leave-balances/${employeeId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leave balance'
      );
    }
  }
);

const initialState = {
  leaves: [],
  currentLeave: null,
  leaveBalances: [],
  currentLeaveBalance: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isApproving: false,
  isRejecting: false,
  error: null,
  successMessage: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  },
};

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentLeave: (state, action) => {
      state.currentLeave = action.payload;
    },
    clearCurrentLeave: (state) => {
      state.currentLeave = null;
    },
    setCurrentLeaveBalance: (state, action) => {
      state.currentLeaveBalance = action.payload;
    },
    clearCurrentLeaveBalance: (state) => {
      state.currentLeaveBalance = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetLeaveState: (state) => {
      state.leaves = [];
      state.currentLeave = null;
      state.leaveBalances = [];
      state.currentLeaveBalance = null;
      state.error = null;
      state.successMessage = null;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leaves
      .addCase(fetchLeaves.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaves = action.payload.results || action.payload;
        if (action.payload.count !== undefined) {
          state.pagination.totalCount = action.payload.count;
          state.pagination.totalPages = Math.ceil(action.payload.count / state.pagination.pageSize);
        }
        state.error = null;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Leave by ID
      .addCase(fetchLeaveById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLeave = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaveById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Leave
      .addCase(createLeave.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.isCreating = false;
        state.leaves.unshift(action.payload);
        state.successMessage = 'Leave request created successfully';
        state.error = null;
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Update Leave
      .addCase(updateLeave.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.currentLeave?.id === action.payload.id) {
          state.currentLeave = action.payload;
        }
        state.successMessage = 'Leave request updated successfully';
        state.error = null;
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Delete Leave
      .addCase(deleteLeave.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.leaves = state.leaves.filter(leave => leave.id !== action.payload);
        if (state.currentLeave?.id === action.payload) {
          state.currentLeave = null;
        }
        state.successMessage = 'Leave request deleted successfully';
        state.error = null;
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Approve Leave
      .addCase(approveLeave.pending, (state) => {
        state.isApproving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.isApproving = false;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.currentLeave?.id === action.payload.id) {
          state.currentLeave = action.payload;
        }
        state.successMessage = 'Leave request approved successfully';
        state.error = null;
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.isApproving = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Reject Leave
      .addCase(rejectLeave.pending, (state) => {
        state.isRejecting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.isRejecting = false;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.currentLeave?.id === action.payload.id) {
          state.currentLeave = action.payload;
        }
        state.successMessage = 'Leave request rejected successfully';
        state.error = null;
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.isRejecting = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
      // Fetch Leave Balances
      .addCase(fetchLeaveBalances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveBalances = action.payload.results || action.payload;
        state.error = null;
      })
      .addCase(fetchLeaveBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Leave Balance by Employee
      .addCase(fetchLeaveBalanceByEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalanceByEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLeaveBalance = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaveBalanceByEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setCurrentLeave,
  clearCurrentLeave,
  setCurrentLeaveBalance,
  clearCurrentLeaveBalance,
  setPagination,
  resetLeaveState,
} = leaveSlice.actions;

// Selectors
export const selectLeaves = (state) => state.leaves.leaves;
export const selectCurrentLeave = (state) => state.leaves.currentLeave;
export const selectLeaveBalances = (state) => state.leaves.leaveBalances;
export const selectCurrentLeaveBalance = (state) => state.leaves.currentLeaveBalance;
export const selectLeavesLoading = (state) => state.leaves.isLoading;
export const selectLeavesCreating = (state) => state.leaves.isCreating;
export const selectLeavesUpdating = (state) => state.leaves.isUpdating;
export const selectLeavesDeleting = (state) => state.leaves.isDeleting;
export const selectLeavesApproving = (state) => state.leaves.isApproving;
export const selectLeavesRejecting = (state) => state.leaves.isRejecting;
export const selectLeavesError = (state) => state.leaves.error;
export const selectLeavesSuccessMessage = (state) => state.leaves.successMessage;
export const selectLeavesPagination = (state) => state.leaves.pagination;

export default leaveSlice.reducer;

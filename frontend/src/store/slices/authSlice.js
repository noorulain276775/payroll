import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
import secureStorage from '../../utils/secureStorage';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login/`, credentials);
      const { access, refresh, user } = response.data;
      
      // Store tokens securely
      secureStorage.setToken(access);
      secureStorage.setRefreshToken(refresh);
      secureStorage.setUserType(user.user_type);
      secureStorage.setUserData(user);
      
      return { user, access, refresh };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Clear secure storage
      secureStorage.clearAll();
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const refresh = secureStorage.getRefreshToken();
      if (!refresh) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${BASE_URL}/users/refresh/`, {
        refresh
      });
      
      const { access } = response.data;
      secureStorage.setToken(access);
      
      return { access };
    } catch (error) {
      // If refresh fails, logout user
      secureStorage.clearAll();
      return rejectWithValue('Token refresh failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = secureStorage.getToken();
      if (!token) {
        throw new Error('No auth token');
      }

      const response = await axios.get(`${BASE_URL}/users/user/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user data'
      );
    }
  }
);

const initialState = {
  user: secureStorage.getUserData(),
  token: secureStorage.getToken(),
  refreshToken: secureStorage.getRefreshToken(),
  userType: secureStorage.getUserType(),
  isAuthenticated: secureStorage.isAuthenticated(),
  isLoading: false,
  error: null,
  isTokenRefreshing: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
      secureStorage.setUserType(action.payload);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      secureStorage.setUserData(state.user);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.userType = null;
      state.isAuthenticated = false;
      secureStorage.clearAll();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.userType = action.payload.user.user_type;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // Still logout even if API call fails
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isTokenRefreshing = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isTokenRefreshing = false;
        state.token = action.payload.access;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isTokenRefreshing = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Don't logout on user fetch failure
      });
  }
});

export const { clearError, setUserType, updateUser, clearAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectUserType = (state) => state.auth.userType;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsTokenRefreshing = (state) => state.auth.isTokenRefreshing;

export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from '../../config';
import secureStorage from '../../utils/secureStorage';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with credentials:', { username: credentials.username });
      console.log('Login URL:', `${BASE_URL}${API_ENDPOINTS.LOGIN}`);
      
      const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.LOGIN}`, credentials);
      
      console.log('Login response received:', response.data);
      
      // Store tokens securely
      const tokenStored = secureStorage.setToken(response.data.access);
      const refreshTokenStored = secureStorage.setRefreshToken(response.data.refresh);
      const userDataStored = secureStorage.setUserData({
        id: response.data.user_id,
        username: response.data.username,
        user_type: response.data.user_type,
        last_login: response.data.last_login
      });
      const userTypeStored = secureStorage.setUserType(response.data.user_type);
      const authStored = secureStorage.setAuthenticated(true);
      
      console.log('Storage results:', {
        tokenStored,
        refreshTokenStored,
        userDataStored,
        userTypeStored,
        authStored
      });
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
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
      const refreshToken = getState().auth.refreshToken;
      const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
        refresh: refreshToken
      });
      
      // Update stored token
      secureStorage.setToken(response.data.access);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      );
    }
  }
);

// Removed getCurrentUser since we don't have this endpoint and don't need it
// export const getCurrentUser = createAsyncThunk(
//   'auth/getCurrentUser',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const token = secureStorage.getToken();
//       if (!token) {
//         throw new Value('No auth token');
//       }

//       const response = await axios.get(`${BASE_URL}/users/user/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to get user data'
//       );
//     }
//   }
// );

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  userType: null,
  isAuthenticated: false,
  isLoading: false, // Start with loading false to allow form input
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
    initializeAuth: (state) => {
      try {
        // Initialize auth state from secure storage
        const user = secureStorage.getUserData();
        const token = secureStorage.getToken();
        const refreshToken = secureStorage.getRefreshToken();
        const userType = secureStorage.getUserType();
        const isAuthenticated = secureStorage.isAuthenticated();
        
        // Only update if we have valid data
        if (token && user && userType) {
          state.user = user;
          state.token = token;
          state.refreshToken = refreshToken;
          state.userType = userType;
          state.isAuthenticated = isAuthenticated;
        } else {
          // Clear state if no valid data
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.userType = null;
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Set default state on error
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      }
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
        console.log('Login fulfilled with payload:', action.payload);
        state.isLoading = false;
        state.isAuthenticated = true;
        // Backend response structure: { access, refresh, user_id, user_type, username, last_login }
        state.user = {
          id: action.payload.user_id,
          username: action.payload.username,
          user_type: action.payload.user_type,
          last_login: action.payload.last_login
        };
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.userType = action.payload.user_type;
        state.error = null;
        console.log('Updated state:', {
          isAuthenticated: state.isAuthenticated,
          userType: state.userType,
          user: state.user
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('Login rejected with payload:', action.payload);
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
        console.log('Updated state after rejection:', {
          isAuthenticated: state.isAuthenticated,
          userType: state.userType,
          error: state.error
        });
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
      
      // Removed getCurrentUser cases since the function is not used
      // // Get Current User
      // .addCase(getCurrentUser.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(getCurrentUser.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.user = action.payload;
      //   state.error = null;
      // })
      // .addCase(getCurrentUser.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload;
      //   // Don't logout on user fetch failure
      // });
  }
});

export const { clearError, setUserType, updateUser, clearAuth, initializeAuth } = authSlice.actions;

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

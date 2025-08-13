import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  theme: 'light',
  sidebarUnfoldable: false,
  isLoading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSidebarUnfoldable: (state, action) => {
      state.sidebarUnfoldable = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setSidebarShow,
  setTheme,
  setSidebarUnfoldable,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;

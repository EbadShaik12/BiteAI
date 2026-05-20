import { createSlice } from '@reduxjs/toolkit';

// Retrieve cached session
const cachedUser = localStorage.getItem('biteai_user') 
  ? JSON.parse(localStorage.getItem('biteai_user')) 
  : null;
const cachedToken = localStorage.getItem('biteai_token') || null;

const initialState = {
  user: cachedUser,
  token: cachedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Cache session data
      localStorage.setItem('biteai_user', JSON.stringify(action.payload.user));
      localStorage.setItem('biteai_token', action.payload.token);
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateGoalsSuccess: (state, action) => {
      state.loading = false;
      state.user = {
        ...state.user,
        ...action.payload
      };
      // Refresh localStorage
      localStorage.setItem('biteai_user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('biteai_user');
      localStorage.removeItem('biteai_token');
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { authStart, authSuccess, authFailure, updateGoalsSuccess, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

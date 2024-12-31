import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, register, logout, loadUserFromToken } from './authAPI';
// import { AuthResponse } from './authTypes';
import { User, LoginResponse, RegisterResponse } from '@repo/schemas';

export interface AuthState {
  // token: string | null,
  user: User | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: any | null
} 

const initialState: AuthState = {
  // token: null,
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        // state.token = action.payload.token;
        state.user = action.payload.data.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed.';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.status = 'succeeded';
        // state.token = action.payload.token;
        state.user = action.payload.data.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed.';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        // state.token = null;
        state.user = null;
        state.status = 'idle';
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        // state.token = action.payload.token;
        state.status = 'succeeded';
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.user = null;
        // state.token = null;
        state.status = 'failed';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

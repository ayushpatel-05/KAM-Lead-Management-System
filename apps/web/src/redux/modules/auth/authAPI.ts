import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';
// import { AuthResponse, LoginPayload, RegisterPayload } from './authTypes';
import { LoginPayload, RegisterPayload, LoginResponse, RegisterResponse } from "@repo/schemas"

// Login a user
export const login = createAsyncThunk<LoginResponse, LoginPayload>(
  'auth/login',
  async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
);

// Register a user
export const register = createAsyncThunk<RegisterResponse, RegisterPayload>(
  'auth/register',
  async (userDetails) => {
    const response = await api.post('/auth/register', userDetails);
    return response.data;
  }
);

// Logout a user
export const logout = createAsyncThunk<void>('auth/logout', async () => {
  await api.post('/auth/logout');
});

// Load User data
export const loadUserFromToken = createAsyncThunk(
  'auth/loadUserFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/me"); // API call to verify token
      return response.data;
    } catch (error) {
      return rejectWithValue('Invalid token');
    }
  }
);
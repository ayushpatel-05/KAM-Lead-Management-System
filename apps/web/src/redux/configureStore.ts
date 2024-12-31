"use client";
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './modules/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;

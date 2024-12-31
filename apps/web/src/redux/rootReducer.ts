"use client";
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from "./modules/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer
});

export default rootReducer;
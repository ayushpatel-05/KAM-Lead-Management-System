import { RootState } from '../../configureStore';
import { AuthState } from './authSlice';

// Select current user
export const selectCurrentUser = (state: RootState): AuthState['user'] => state.auth.user;

// // Select auth token
// export const selectAuthToken = (state: RootState): string | null => state.auth.token;

// Select auth status
export const selectAuthStatus = (state: RootState): 'idle' | 'loading' | 'succeeded' | 'failed' =>
  state.auth.status;

// Select auth error
export const selectAuthError = (state: RootState): string | null => state.auth.error;

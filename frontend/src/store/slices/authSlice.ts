import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthResponse } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = {
        id: action.payload.user_id,
        username: action.payload.username,
        email: action.payload.email,
        avatar_url: '',
        bio: '',
        tech_stack: '',
        is_creator: false,
        follower_count: 0,
        following_count: 0,
        created_at: '',
        updated_at: '',
      };
      state.error = null;
      
      // 保存到localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = {
        id: action.payload.user_id,
        username: action.payload.username,
        email: action.payload.email,
        avatar_url: '',
        bio: '',
        tech_stack: '',
        is_creator: false,
        follower_count: 0,
        following_count: 0,
        created_at: '',
        updated_at: '',
      };
      state.error = null;
      
      // 保存到localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      
      // 清除localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  clearError,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;

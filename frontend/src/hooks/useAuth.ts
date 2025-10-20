import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure, 
  logout, 
  updateUser,
  clearError 
} from '../store/slices/authSlice';
import { LoginRequest, RegisterRequest, User } from '../types';
import apiService from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (credentials: LoginRequest) => {
    dispatch(loginStart());
    try {
      const response = await apiService.login(credentials);
      dispatch(loginSuccess(response));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '登录失败';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const register = useCallback(async (userData: RegisterRequest) => {
    dispatch(registerStart());
    try {
      const response = await apiService.register(userData);
      dispatch(registerSuccess(response));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '注册失败';
      dispatch(registerFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const updateUserProfile = useCallback(async (userData: Partial<User>) => {
    try {
      await apiService.updateProfile(userData);
      if (user) {
        const updatedUser = { ...user, ...userData };
        dispatch(updateUser(updatedUser));
      }
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '更新失败';
      return { success: false, error: errorMessage };
    }
  }, [dispatch, user]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
    updateProfile: updateUserProfile,
    clearError: clearAuthError,
  };
};

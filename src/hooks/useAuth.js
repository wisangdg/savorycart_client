import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from '../store';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants';
import { handleApiError } from '../utils/errorHandlers';

/**
 * Custom hook for authentication
 * @returns {Object} Object containing auth state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  const isAuthenticated = !!token;
  
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise that resolves to login result
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      
      dispatch(setCredentials({
        token,
        user,
      }));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: handleApiError(error) 
      };
    }
  }, [dispatch]);
  
  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise that resolves to registration result
   */
  const register = useCallback(async (userData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return { 
        success: false, 
        message: handleApiError(error) 
      };
    }
  }, []);
  
  /**
   * Check login status
   * @returns {Promise} Promise that resolves to check result
   */
  const checkLoginStatus = useCallback(async () => {
    try {
      if (!token) {
        dispatch(logout());
        return { success: false };
      }

      const response = await axiosInstance.get(API_ENDPOINTS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        dispatch(
          setCredentials({
            token: token,
            user: response.data,
          })
        );
        return { success: true };
      } else {
        dispatch(logout());
        return { success: false };
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch(logout());
      return { 
        success: false, 
        message: handleApiError(error) 
      };
    }
  }, [token, dispatch]);
  
  /**
   * Logout user
   */
  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  
  return {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout: logoutUser,
    checkLoginStatus,
  };
};

export default useAuth;

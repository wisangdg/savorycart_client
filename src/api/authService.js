import axiosInstance from "./axiosInstance";
import { setCredentials, logout } from "../store";

/**
 * Service untuk manajemen autentikasi
 */
class AuthService {
  /**
   * Login user
   * @param {Object} credentials - Email dan password
   * @returns {Promise} - Promise dengan data user dan token
   */
  async login(credentials) {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 1, message: "Network error" };
    }
  }

  /**
   * Logout user
   * @returns {Promise} - Promise dengan status logout
   */
  async logout() {
    try {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 1, message: "Network error" };
    }
  }

  /**
   * Register user
   * @param {Object} userData - Data user untuk registrasi
   * @returns {Promise} - Promise dengan data user
   */
  async register(userData) {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 1, message: "Network error" };
    }
  }

  /**
   * Refresh token
   * @returns {Promise} - Promise dengan token baru
   */
  async refreshToken() {
    try {
      const response = await axiosInstance.post("/auth/refresh-token", {});
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 1, message: "Network error" };
    }
  }

  /**
   * Setup interceptor untuk auto refresh token
   * @param {Function} dispatch - Redux dispatch function
   */
  setupTokenRefresh(dispatch) {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Jika token kedaluwarsa dan perlu di-refresh
        if (
          error.response?.status === 401 &&
          error.response.data.needsRefresh &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const { data } = await axiosInstance.post("/auth/refresh-token");
            dispatch(setCredentials(data.data));
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${data.data.token}`;
            return axiosInstance(originalRequest);
          } catch (_error) {
            dispatch(logout());
            return Promise.reject(_error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }
}

export default new AuthService();

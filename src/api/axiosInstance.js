/**
 * @module api/axiosInstance
 * @description Konfigurasi Axios untuk komunikasi dengan API
 */
import axios from "axios";
import authService from "./authService";

// Gunakan env Vite saat tersedia; default ke relative path untuk proxy dev
const API_BASE_URL = import.meta?.env?.VITE_API_URL || "";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 detik timeout
  withCredentials: true, // Penting untuk mengirim cookie (misal: refresh token)
});

// Single interceptor untuk menambahkan token otentikasi ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor untuk response
 * Menangani berbagai jenis error (network, timeout, unauthorized, server)
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Retry ringan otomatis untuk network / 5xx awal (maks 2x)
    const original = error.config;
    if (!original.__retryCount) original.__retryCount = 0;

    const canRetry =
      (!error.response ||
        (error.response.status >= 500 && error.response.status < 600)) &&
      original.__retryCount < 2;

    if (canRetry) {
      original.__retryCount++;
      const wait = 200 * original.__retryCount + Math.random() * 120;
      await new Promise((r) => setTimeout(r, wait));
      return axiosInstance(original);
    }

    console.error("API Error:", error);

    // Tangani error network
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        error.isTimeoutError = true;
        error.message = "Request timeout: Server is taking too long to respond";
      } else if (error.message === "Network Error") {
        error.isNetworkError = true;
        error.message =
          "Network error: Please check your internet connection and server status";
      }
      return Promise.reject(error);
    }

    // Tangani error HTTP
    if (error.response.status >= 500) {
      error.isServerError = true;
      error.message = "Server error: Please try again later";
    } else if (error.response.status === 401) {
      // Tangani unauthorized
      if (error.response.data?.needsRefresh) {
        // Coba untuk refresh token
        try {
          await authService.refreshToken();
          return axiosInstance(error.config);
        } catch (refreshError) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("token");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Konfigurasi global axios
axios.defaults.withCredentials = import.meta.env.PROD;

export default axiosInstance;

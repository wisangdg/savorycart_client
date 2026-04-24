import { useState, useCallback } from 'react';

/**
 * Hook untuk penanganan error global
 * @returns {Object} Error handler methods dan state
 */
const useErrorHandler = () => {
  const [error, setError] = useState(null);
  
  /**
   * Menangani error dan menyimpannya ke state
   * @param {Error|Object|string} err - Error yang akan ditangani
   * @param {string} fallbackMessage - Pesan default jika error tidak memiliki pesan
   */
  const handleError = useCallback((err, fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.') => {
    console.error('Error caught by useErrorHandler:', err);
    
    // Tentukan pesan error berdasarkan tipe error
    let errorMessage = fallbackMessage;
    let errorTitle = 'Error';
    let errorDetails = null;
    
    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err instanceof Error) {
      errorMessage = err.message || fallbackMessage;
      errorDetails = err.stack;
    } else if (err && typeof err === 'object') {
      // Handle Axios error
      if (err.isAxiosError) {
        errorTitle = `Error ${err.response?.status || ''}`;
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        if (err.response?.data?.details) {
          errorDetails = err.response.data.details;
        }
        
        // Network error
        if (err.message === 'Network Error') {
          errorTitle = 'Network Error';
          errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        }
      } else if (err.message) {
        errorMessage = err.message;
        
        if (err.name) {
          errorTitle = err.name;
        }
        
        if (err.details) {
          errorDetails = err.details;
        }
      }
    }
    
    setError({
      title: errorTitle,
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
      raw: err
    });
    
    // Log error ke server jika diperlukan
    logErrorToServer(err, errorMessage);
    
    return errorMessage;
  }, []);
  
  /**
   * Mengirim error ke server untuk logging
   * @param {Error|Object|string} err - Error yang akan dikirim
   * @param {string} message - Pesan error yang sudah diformat
   */
  const logErrorToServer = useCallback((err, message) => {
    // Implementasi pengiriman error ke server
    // Contoh menggunakan fetch API
    try {
      fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: err instanceof Error ? err.toString() : JSON.stringify(err),
          message,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
      }).catch(logErr => {
        // Silent fail untuk error logging
        console.warn('Failed to log error to server:', logErr);
      });
    } catch (loggingError) {
      // Silent fail
      console.warn('Error during error logging:', loggingError);
    }
  }, []);
  
  /**
   * Menghapus error dari state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    handleError,
    clearError
  };
};

export default useErrorHandler;

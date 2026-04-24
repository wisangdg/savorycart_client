import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../styles/error.css';

/**
 * ErrorBoundary component untuk menangkap error di React component tree
 * dan menampilkan fallback UI yang user-friendly
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state sehingga render berikutnya akan menampilkan fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error ke layanan error reporting
    this.setState({ errorInfo });
    
    // Log error ke console di development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Kirim error ke server untuk logging (jika diperlukan)
    this.logErrorToServer(error, errorInfo);
  }
  
  logErrorToServer(error, errorInfo) {
    // Implementasi pengiriman error ke server
    // Contoh menggunakan fetch API
    try {
      fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          componentStack: errorInfo?.componentStack || '',
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
      }).catch(err => {
        // Silent fail untuk error logging
        console.warn('Failed to log error to server:', err);
      });
    } catch (loggingError) {
      // Silent fail
      console.warn('Error during error logging:', loggingError);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;
    
    // Jika tidak ada error, render children seperti biasa
    if (!hasError) {
      return children;
    }
    
    // Jika ada custom fallback, gunakan itu
    if (fallback) {
      return fallback(error, errorInfo, this.handleReload);
    }
    
    // Default fallback UI
    return (
      <div className="error-boundary">
        <div className="error-container">
          <div className="error-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1>Oops! Terjadi kesalahan</h1>
          <p>Maaf, terjadi kesalahan saat memuat halaman ini.</p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="error-details">
              <h3>Detail Error:</h3>
              <p className="error-message">{error?.toString()}</p>
              <pre className="error-stack">{errorInfo?.componentStack}</pre>
            </div>
          )}
          
          <div className="error-actions">
            <button 
              className="btn btn-primary" 
              onClick={this.handleReload}
            >
              Muat Ulang Halaman
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={this.handleGoHome}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
};

export default ErrorBoundary;

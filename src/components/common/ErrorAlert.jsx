import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/error.css';

/**
 * ErrorAlert component untuk menampilkan pesan error
 * @param {Object} props - Component props
 * @param {string} props.title - Judul error
 * @param {string} props.message - Pesan error
 * @param {Function} props.onClose - Callback saat tombol close diklik
 * @param {Function} props.onRetry - Callback saat tombol retry diklik
 * @param {boolean} props.showRetry - Apakah menampilkan tombol retry
 * @returns {JSX.Element} ErrorAlert component
 */
const ErrorAlert = ({ 
  title = 'Error', 
  message, 
  onClose, 
  onRetry, 
  showRetry = false 
}) => {
  return (
    <div className="error-alert" role="alert">
      <div className="error-alert-icon">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
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
      
      <div className="error-alert-content">
        <div className="error-alert-title">{title}</div>
        <p className="error-alert-message">{message}</p>
      </div>
      
      {showRetry && onRetry && (
        <button 
          className="btn btn-sm btn-outline-danger" 
          onClick={onRetry}
          aria-label="Coba lagi"
        >
          Coba Lagi
        </button>
      )}
      
      {onClose && (
        <button 
          className="error-alert-close" 
          onClick={onClose}
          aria-label="Tutup pesan error"
        >
          &times;
        </button>
      )}
    </div>
  );
};

ErrorAlert.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onRetry: PropTypes.func,
  showRetry: PropTypes.bool
};

export default ErrorAlert;

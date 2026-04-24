import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useErrorHandler from '../hooks/useErrorHandler';
import ErrorAlert from '../components/common/ErrorAlert';

// Create context
const ErrorContext = createContext(null);

/**
 * Provider untuk error handling global
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} ErrorProvider component
 */
export const ErrorProvider = ({ children }) => {
  const { error, handleError, clearError } = useErrorHandler();
  
  return (
    <ErrorContext.Provider value={{ handleError, clearError }}>
      {error && (
        <ErrorAlert
          title={error.title}
          message={error.message}
          onClose={clearError}
        />
      )}
      {children}
    </ErrorContext.Provider>
  );
};

ErrorProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Hook untuk menggunakan error context
 * @returns {Object} Error context
 */
export const useError = () => {
  const context = useContext(ErrorContext);
  
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  
  return context;
};

export default ErrorProvider;

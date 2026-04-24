/**
 * Handle API errors consistently
 * @param {Error} error - Error object from API call
 * @param {Function} setError - Function to set error state
 * @returns {string} Error message
 */
export const handleApiError = (error, setError = null) => {
  let errorMessage = 'An unexpected error occurred. Please try again later.';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    if (status === 401) {
      errorMessage = 'Authentication failed. Please log in again.';
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (status === 422 && data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = data.error;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your internet connection.';
  }
  
  // Set error state if provided
  if (setError) {
    setError(errorMessage);
  }
  
  // Log error for debugging
  console.error('API Error:', error);
  
  return errorMessage;
};

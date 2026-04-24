import { handleApiError } from '../../utils/errorHandlers';

describe('handleApiError', () => {
  // Mock console.error to prevent test output pollution
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  
  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('returns default error message for generic error', () => {
    const error = new Error('Generic error');
    const result = handleApiError(error);
    expect(result).toBe('An unexpected error occurred. Please try again later.');
    expect(console.error).toHaveBeenCalledWith('API Error:', error);
  });

  test('handles 401 status code correctly', () => {
    const error = {
      response: {
        status: 401,
        data: {}
      }
    };
    const result = handleApiError(error);
    expect(result).toBe('Authentication failed. Please log in again.');
  });

  test('handles 403 status code correctly', () => {
    const error = {
      response: {
        status: 403,
        data: {}
      }
    };
    const result = handleApiError(error);
    expect(result).toBe('You do not have permission to perform this action.');
  });

  test('handles 404 status code correctly', () => {
    const error = {
      response: {
        status: 404,
        data: {}
      }
    };
    const result = handleApiError(error);
    expect(result).toBe('The requested resource was not found.');
  });

  test('handles 422 status code with message correctly', () => {
    const error = {
      response: {
        status: 422,
        data: {
          message: 'Validation failed'
        }
      }
    };
    const result = handleApiError(error);
    expect(result).toBe('Validation failed');
  });

  test('handles error with data.error correctly', () => {
    const error = {
      response: {
        status: 500,
        data: {
          error: 'Server error'
        }
      }
    };
    const result = handleApiError(error);
    expect(result).toBe('Server error');
  });

  test('handles network error correctly', () => {
    const error = {
      request: {},
      response: null
    };
    const result = handleApiError(error);
    expect(result).toBe('No response from server. Please check your internet connection.');
  });

  test('calls setError function if provided', () => {
    const error = new Error('Generic error');
    const setError = vi.fn();
    handleApiError(error, setError);
    expect(setError).toHaveBeenCalledWith('An unexpected error occurred. Please try again later.');
  });
});

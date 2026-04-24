import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import useFetchTags from '../../hooks/useFetchTags';

// Mock axios
vi.mock("axios", () => {
  const mockAxios = {
    get: vi.fn(),
    create: vi.fn(() => mockAxios),
    defaults: {},
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  return { default: mockAxios };
});

// Mock API_ENDPOINTS
vi.mock('../../constants', () => ({
  API_ENDPOINTS: {
    TAGS: '/api/tags'
  }
}));

describe('useFetchTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetches tags successfully', async () => {
    // Mock successful response
    const mockTags = [
      { _id: '1', name: 'Tag 1' },
      { _id: '2', name: 'Tag 2' }
    ];
    
    axios.get.mockResolvedValueOnce({ data: mockTags });
    
    // Render the hook
    const { result } = renderHook(() => useFetchTags());
    
    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.tags).toEqual([]);
    
    // Wait for the hook to update
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Check the updated state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.tags).toEqual(mockTags);
    expect(axios.get).toHaveBeenCalledWith('/api/tags');
  });

  test('handles error when fetching tags', async () => {
    // Mock error response
    const error = new Error('Network error');
    axios.get.mockRejectedValueOnce(error);
    
    // Render the hook
    const { result } = renderHook(() => useFetchTags());
    
    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    
    // Wait for the hook to update
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Check the updated state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBe(null);
    expect(result.current.tags).toEqual([]);
  });

  test('refetch function works correctly', async () => {
    // Mock successful response
    const mockTags = [
      { _id: '1', name: 'Tag 1' },
      { _id: '2', name: 'Tag 2' }
    ];
    
    axios.get.mockResolvedValueOnce({ data: mockTags });
    
    // Render the hook
    const { result } = renderHook(() => useFetchTags());
    
    // Wait for the initial fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Mock a different response for refetch
    const newMockTags = [
      { _id: '3', name: 'Tag 3' },
      { _id: '4', name: 'Tag 4' }
    ];
    
    axios.get.mockResolvedValueOnce({ data: newMockTags });
    
    // Call refetch
    act(() => {
      result.current.refetch();
    });
    
    // Check loading state is true again
    expect(result.current.loading).toBe(true);
    
    // Wait for the refetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Check the updated state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.tags).toEqual(newMockTags);
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});

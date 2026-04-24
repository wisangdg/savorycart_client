import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants';
import { handleApiError } from '../utils/errorHandlers';

/**
 * Custom hook to fetch tags
 * @returns {Object} Object containing tags data, loading state, error state, and refetch function
 */
const useFetchTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TAGS);
      setTags(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, error, refetch: fetchTags };
};

export default useFetchTags;

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants';
import { handleApiError } from '../utils/errorHandlers';

/**
 * Custom hook to fetch products with pagination, filtering, and search
 * @param {number} currentPage - Current page number
 * @param {Array} activeTags - Array of active tag objects
 * @param {string} searchKeyword - Search keyword
 * @param {Object} selectedCategory - Selected category object
 * @returns {Object} Object containing products data, loading state, error state, and refetch function
 */
const useFetchProducts = (currentPage, activeTags, searchKeyword, selectedCategory) => {
  const [data, setData] = useState({ menus: [], totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        skip: (currentPage - 1) * 10,
        limit: 10,
        page: currentPage,
        q: searchKeyword,
      };

      if (activeTags && activeTags.length !== 0) {
        params.tags = activeTags.map((tag) => tag._id).join(",");
      }

      if (searchKeyword) {
        params.search = searchKeyword;
      }

      if (selectedCategory && selectedCategory._id !== "all") {
        params.category = selectedCategory.name;
      }

      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
        params,
      });

      setData({
        menus: response.data.data,
        totalPages: response.data.totalPages || 1,
      });
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTags, searchKeyword, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, error, refetch: fetchData };
};

export default useFetchProducts;

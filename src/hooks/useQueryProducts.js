import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../constants";
import { handleApiError } from "../utils/errorHandlers";
import { getFromCache, saveToCache, CACHE_KEYS } from "../utils/storageCache";

/**
 * Custom hook to fetch products with React Query
 * Optimized with improved caching, error handling, and performance
 *
 * @param {Object} options - Query options
 * @param {number} options.page - Current page number
 * @param {Array} options.tags - Array of tag IDs
 * @param {string} options.search - Search keyword
 * @param {string} options.category - Category ID
 * @param {boolean} options.enabled - Whether the query is enabled
 * @returns {Object} Query result with additional prefetch functionality
 */
export const useQueryProducts = (options = {}) => {
  const {
    page = 1,
    tags = [],
    search = "",
    category = null,
    enabled = true,
  } = options;

  // Get query client
  const queryClient = useQueryClient();

  // Create a query key based on the options
  const queryKey = ["products", { page, tags, search, category }];

  // Create a cache key for local storage
  const cacheKey = `${CACHE_KEYS.PRODUCTS}_${page}_${
    tags.length > 0 ? tags.map((t) => t._id).join("-") : "notags"
  }_${search || "nosearch"}_${category ? category._id : "nocat"}`;

  // Define the query function with optimized caching
  const fetchProducts = async () => {
    try {
      // Try to get from cache first for better performance
      const cachedData = getFromCache(cacheKey);
      if (cachedData && !search) {
        // Don't use cache for search queries as they're more dynamic
        return cachedData;
      }

      const params = {
        skip: (page - 1) * 10,
        limit: 10,
      };

      if (tags && tags.length !== 0) {
        params.tags = Array.isArray(tags)
          ? tags.map((tag) => tag._id).join(",")
          : tags;
      }

      if (search) {
        params.q = search;
      }

      if (category && category._id !== "all") {
        params.category = category.name;
      }

      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
        params,
      });

      const result = {
        data: response.data.data,
        totalPages: response.data.totalPages || 1,
      };

      // Save to cache if not a search query
      if (!search) {
        saveToCache(cacheKey, result, 5 * 60); // Cache for 5 minutes
      }

      return result;
    } catch (error) {
      // Enhanced error handling
      if (error.isNetworkError) {
        throw {
          ...error,
          message: "Network error: Please check your internet connection.",
        };
      } else if (error.isTimeoutError) {
        throw {
          ...error,
          message: "Request timed out: Server is taking too long to respond.",
        };
      } else if (error.isServerError) {
        throw { ...error, message: "Server error: Please try again later." };
      } else {
        throw handleApiError(error);
      }
    }
  };

  // Use the useQuery hook with optimized settings
  const query = useQuery({
    queryKey,
    queryFn: fetchProducts,
    enabled,
    retry: import.meta.env.TEST ? false : 2,
    retryDelay: import.meta.env.TEST ? 0 : (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: search ? 30000 : 300000, // 30 seconds for search, 5 minutes for regular queries
    cacheTime: 600000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when reconnecting
    onError: (error) => {
      console.error("Error in products query:", error);
    },
  });

  // Optimized prefetch next page function
  const prefetchNextPage = () => {
    if (page < query.data?.totalPages) {
      const nextPage = page + 1;
      const nextPageQueryKey = [
        "products",
        { page: nextPage, tags, search, category },
      ];

      // Check if we already have this data in the cache
      const existingData = queryClient.getQueryData(nextPageQueryKey);
      if (existingData) {
        return; // Skip prefetching if we already have the data
      }

      // Create a new fetch function for the next page
      const fetchNextPage = async () => {
        try {
          // Try to get from cache first
          const nextCacheKey = `${CACHE_KEYS.PRODUCTS}_${nextPage}_${
            tags.length > 0 ? tags.map((t) => t._id).join("-") : "notags"
          }_${search || "nosearch"}_${category ? category._id : "nocat"}`;

          const cachedData = getFromCache(nextCacheKey);
          if (cachedData && !search) {
            return cachedData;
          }

          const params = {
            skip: (nextPage - 1) * 10,
            limit: 10,
          };

          if (tags && tags.length !== 0) {
            params.tags = Array.isArray(tags)
              ? tags.map((tag) => tag._id).join(",")
              : tags;
          }

          if (search) {
            params.q = search;
          }

          if (category && category._id !== "all") {
            params.category = category.name;
          }

          const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
            params,
          });

          const result = {
            data: response.data.data,
            totalPages: response.data.totalPages || 1,
          };

          // Save to cache if not a search query
          if (!search) {
            saveToCache(nextCacheKey, result, 5 * 60); // Cache for 5 minutes
          }

          return result;
        } catch (error) {
          // Just log the error for prefetch, don't throw
          console.error("Error prefetching next page:", error);
          return null;
        }
      };

      // Use prefetchQuery with lower priority
      queryClient.prefetchQuery({
        queryKey: nextPageQueryKey,
        queryFn: fetchNextPage,
        staleTime: search ? 30000 : 300000,
      });
    }
  };

  return {
    ...query,
    prefetchNextPage,
  };
};

export default useQueryProducts;

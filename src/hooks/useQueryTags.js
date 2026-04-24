import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../constants";
import { handleApiError } from "../utils/errorHandlers";
import { getFromCache, saveToCache, CACHE_KEYS } from "../utils/storageCache";

/**
 * Custom hook to fetch tags with React Query
 * Optimized with improved caching, error handling, and performance
 *
 * @returns {Object} Query result with optimized caching
 */
export const useQueryTags = () => {
  // Define the query function with optimized caching
  const fetchTags = async () => {
    try {
      // Try to get from cache first with longer expiration
      const cachedTags = getFromCache(CACHE_KEYS.TAGS);
      if (cachedTags) {
        return cachedTags;
      }

      // If not in cache, fetch from API
      const response = await axiosInstance.get(API_ENDPOINTS.TAGS);
      const tags = Array.isArray(response.data) ? response.data : [];

      // Save to cache with longer expiration (2 hours) since tags rarely change
      saveToCache(CACHE_KEYS.TAGS, tags, 2 * 60 * 60);

      return tags;
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
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 60, // 1 hour - tags don't change often
    cacheTime: 1000 * 60 * 120, // 2 hours
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with max 30s
  });
};

export default useQueryTags;

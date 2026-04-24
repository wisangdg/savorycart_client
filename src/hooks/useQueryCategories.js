import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../constants";
import { handleApiError } from "../utils/errorHandlers";
import { CATEGORY_NAME_MAP } from "../constants";
import { getFromCache, saveToCache, CACHE_KEYS } from "../utils/storageCache";

/**
 * Custom hook to fetch categories with React Query
 * @returns {Object} Query result
 */
export const useQueryCategories = () => {
  // Define the query function
  const fetchCategories = async () => {
    try {
      // Try to get from cache first
      const cachedCategories = getFromCache(CACHE_KEYS.CATEGORIES);
      if (cachedCategories) {
        console.log("Using cached categories");
        return cachedCategories;
      }

      // If not in cache, fetch from API
      const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES);

      // Map categories with display names
      const categories = Array.isArray(response.data) ? response.data : [];

      const mappedCategories = [
        { _id: "all", name: "Semua", originalName: "all" },
        ...categories.map((cat) => ({
          ...cat,
          name: CATEGORY_NAME_MAP[cat.name] || cat.name,
          originalName: cat.name,
        })),
      ];

      // Save to cache
      saveToCache(CACHE_KEYS.CATEGORIES, mappedCategories);

      return mappedCategories;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  // Use the useQuery hook
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour - categories rarely change
  });
};

export default useQueryCategories;

/**
 * Utility functions for localStorage caching
 * Optimized for performance and flexibility
 */

// In-memory cache for even faster access
const memoryCache = new Map();

// Cache keys
export const CACHE_KEYS = {
  CATEGORIES: "foodstore_categories",
  TAGS: "foodstore_tags",
  PRODUCTS: "foodstore_products",
  CART: "foodstore_cart",
  USER: "foodstore_user",
};

// Default cache expiration times (in seconds)
export const CACHE_EXPIRATION = {
  CATEGORIES: 24 * 60 * 60, // 24 hours
  TAGS: 12 * 60 * 60, // 12 hours
  PRODUCTS: 5 * 60, // 5 minutes
  CART: 30 * 24 * 60 * 60, // 30 days
  USER: 7 * 24 * 60 * 60, // 7 days
};

/**
 * Get data from cache with improved performance using memory cache
 *
 * @param {string} key - Cache key
 * @returns {any} Cached data or null if not found or expired
 */
export const getFromCache = (key) => {
  try {
    // First check memory cache for ultra-fast access
    if (memoryCache.has(key)) {
      const { data, expiry } = memoryCache.get(key);
      const now = Math.floor(Date.now() / 1000); // Current time in seconds

      if (expiry > now) {
        return data;
      } else {
        // Expired, remove from memory cache
        memoryCache.delete(key);
      }
    }

    // If not in memory cache, check localStorage
    const cachedData = localStorage.getItem(key);

    if (!cachedData) {
      return null;
    }

    const { data, timestamp } = JSON.parse(cachedData);
    const now = Date.now();

    // Get expiration time in milliseconds
    const expirationTime =
      CACHE_EXPIRATION[key.split("_")[1]?.toUpperCase()] * 1000 || 0;

    if (now - timestamp > expirationTime) {
      // Cache expired, remove it
      localStorage.removeItem(key);
      return null;
    }

    // Store in memory cache for future fast access
    const expirySeconds =
      Math.floor(now / 1000) + Math.floor(expirationTime / 1000);
    memoryCache.set(key, { data, expiry: expirySeconds });

    return data;
  } catch (error) {
    console.error("Error getting data from cache:", error);
    return null;
  }
};

/**
 * Save data to cache with improved flexibility
 *
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} [expirationSeconds] - Custom expiration time in seconds
 */
export const saveToCache = (key, data, expirationSeconds) => {
  try {
    const now = Date.now();
    const nowSeconds = Math.floor(now / 1000);

    // Get default expiration time based on key type or use provided expiration
    let expiry;
    if (expirationSeconds) {
      expiry = nowSeconds + expirationSeconds;
    } else {
      const keyType = key.split("_")[1]?.toUpperCase();
      expiry = nowSeconds + (CACHE_EXPIRATION[keyType] || 300); // Default to 5 minutes
    }

    const cacheData = {
      data,
      timestamp: now,
    };

    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(cacheData));

    // Also save to memory cache for faster access
    memoryCache.set(key, { data, expiry });
  } catch (error) {
    console.error("Error saving data to cache:", error);
  }
};

/**
 * Clear all cache from both localStorage and memory cache
 */
export const clearCache = () => {
  try {
    // Clear localStorage
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Clear memory cache
    memoryCache.clear();

    console.log("Cache cleared successfully");
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

/**
 * Clear specific cache from both localStorage and memory cache
 *
 * @param {string} key - Cache key
 */
export const clearCacheByKey = (key) => {
  try {
    // Clear from localStorage
    localStorage.removeItem(key);

    // Clear from memory cache
    memoryCache.delete(key);

    console.log(`Cache for key ${key} cleared successfully`);
  } catch (error) {
    console.error(`Error clearing cache for key ${key}:`, error);
  }
};

/**
 * Get cache size in bytes
 *
 * @returns {Object} Cache size information
 */
export const getCacheSize = () => {
  try {
    let localStorageSize = 0;
    let memoryCacheSize = 0;

    // Calculate localStorage size
    Object.values(CACHE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        localStorageSize += item.length * 2; // UTF-16 characters are 2 bytes each
      }
    });

    // Calculate memory cache size (approximate)
    memoryCache.forEach((value, key) => {
      memoryCacheSize += JSON.stringify(value).length * 2;
      memoryCacheSize += key.length * 2;
    });

    return {
      localStorageSize: `${(localStorageSize / 1024).toFixed(2)} KB`,
      memoryCacheSize: `${(memoryCacheSize / 1024).toFixed(2)} KB`,
      totalSize: `${((localStorageSize + memoryCacheSize) / 1024).toFixed(
        2
      )} KB`,
    };
  } catch (error) {
    console.error("Error calculating cache size:", error);
    return { error: "Failed to calculate cache size" };
  }
};

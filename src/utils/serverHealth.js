import axiosInstance from "../api/axiosInstance";

/**
 * Single ping
 */
export const checkServerHealth = async () => {
  try {
    const response = await axiosInstance.get("/api/ping", { timeout: 4000 });
    return {
      isHealthy: true,
      status: response.data.status,
      db: response.data.db,
      message: response.data.message || "Server is running",
    };
  } catch (error) {
    return {
      isHealthy: false,
      error: error.message,
      message: "Server is not responding",
      code: error.code,
      isNetwork: !error.response,
    };
  }
};

/**
 * Wait with fast initial retries + exponential backoff.
 * Suppresses early transient failures (server cold start, DB connecting, dev reload).
 */
export const waitForServer = async ({
  maxAttempts = 6,
  initialDelay = 300,
  backoffFactor = 1.8,
  gracePeriodMs = 0,
} = {}) => {
  if (gracePeriodMs) {
    await new Promise((r) => setTimeout(r, gracePeriodMs));
  }
  let delay = initialDelay;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const health = await checkServerHealth();
    if (health.isHealthy) return { ...health, attempts: attempt };
    // Log silently in dev only
    if (import.meta.env.DEV) {
      console.debug(
        `[health] attempt ${attempt}/${maxAttempts} failed: ${health.message} (${health.error})`
      );
    }
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * backoffFactor, 5000);
    } else {
      return { ...health, attempts: attempt };
    }
  }
};

/** Convenience helper returning final health with retries */
export const getStartupHealth = () =>
  waitForServer({ maxAttempts: 6, initialDelay: 200, gracePeriodMs: 150 });

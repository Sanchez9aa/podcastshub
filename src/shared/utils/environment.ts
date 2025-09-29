/**
 * Environment configuration utilities
 * Centralized configuration for deployment paths and environment-specific settings
 */

/**
 * Get the application base path for routing and assets
 * Uses environment variables with fallback logic
 */
export function getBasePath(): string {
  // Check explicit environment variable first
  const envBasePath = import.meta.env.VITE_APP_BASE_PATH;
  if (envBasePath) {
    return envBasePath;
  }

  // Fallback based on build mode
  return import.meta.env.PROD ? "/podcastshub/" : "/";
}

/**
 * Get the current environment
 */
export function getEnvironment(): "development" | "production" | "test" {
  if (import.meta.env.VITE_APP_ENV) {
    return import.meta.env.VITE_APP_ENV as
      | "development"
      | "production"
      | "test";
  }

  if (import.meta.env.PROD) return "production";
  if (import.meta.env.MODE === "test") return "test";
  return "development";
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnvironment() === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnvironment() === "development";
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return getEnvironment() === "test";
}

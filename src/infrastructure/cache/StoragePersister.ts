import type { Persister } from "@tanstack/react-query-persist-client";
import { CACHE_CONFIG } from "@/shared/constants/api";

interface SafeStoragePersisterOptions {
  storage: Storage;
  key?: string;
  maxRetries?: number;
}

export function createSafeStoragePersister({
  storage,
  key = "REACT_QUERY_OFFLINE_CACHE",
  maxRetries = CACHE_CONFIG.MAX_RETRIES,
}: SafeStoragePersisterOptions): Persister {
  const getStorageInfo = () => {
    try {
      // Rough estimation of localStorage usage
      let totalSize = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const value = storage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
      return { totalSize, keyCount: storage.length };
    } catch {
      return { totalSize: 0, keyCount: 0 };
    }
  };

  const clearOldCacheEntries = async () => {
    try {
      // Clear old React Query cache entries to make space
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const storageKey = storage.key(i);
        if (storageKey?.includes("REACT_QUERY")) {
          keysToRemove.push(storageKey);
        }
      }

      // Remove old entries (keep only the most recent one)
      keysToRemove.slice(0, -1).forEach((keyToRemove) => {
        storage.removeItem(keyToRemove);
      });
    } catch (error) {
      console.error("Failed to clear old cache entries:", error);
    }
  };

  return {
    persistClient: async (client) => {
      let attempts = 0;

      while (attempts < maxRetries) {
        try {
          const serializedClient = JSON.stringify(client);
          storage.setItem(key, serializedClient);
          return;
        } catch (error) {
          attempts++;
          console.warn(`Cache persistence attempt ${attempts} failed:`, error);

          if (error instanceof Error && error.name === "QuotaExceededError") {
            const storageInfo = getStorageInfo();
            console.warn(
              `Storage quota exceeded. Current usage: ${storageInfo.totalSize} bytes, ${storageInfo.keyCount} keys`,
            );

            // Try to free up space
            await clearOldCacheEntries();

            // If last attempt, give up gracefully
            if (attempts === maxRetries) {
              console.error(
                "Unable to persist cache after clearing old entries. Operating without persistence.",
              );
              return;
            }
          } else {
            // For other errors, don't retry
            console.error("Unexpected error persisting cache:", error);
            return;
          }
        }
      }
    },

    restoreClient: async () => {
      try {
        const cached = storage.getItem(key);
        return cached ? JSON.parse(cached) : undefined;
      } catch (error) {
        console.error("Failed to restore cache:", error);
        // Clean up corrupted cache
        try {
          storage.removeItem(key);
        } catch {
          // Ignore cleanup errors
        }
        return undefined;
      }
    },

    removeClient: async () => {
      try {
        storage.removeItem(key);
      } catch (error) {
        console.error("Failed to remove cache:", error);
      }
    },
  };
}

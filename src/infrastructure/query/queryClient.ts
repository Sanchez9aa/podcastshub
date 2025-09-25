import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSafeStoragePersister } from "@/infrastructure/cache/StoragePersister";
import { CACHE_CONFIG, CACHE_KEYS } from "@/shared/constants/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.TTL_24_HOURS,
      gcTime: CACHE_CONFIG.TTL_24_HOURS,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Configure persistent cache with robust localStorage handling
if (typeof window !== "undefined") {
  const safePersister = createSafeStoragePersister({
    storage: window.localStorage,
    key: CACHE_KEYS.PODCASTER_CACHE,
    maxRetries: CACHE_CONFIG.MAX_RETRIES,
  });

  persistQueryClient({
    queryClient,
    persister: safePersister,
    maxAge: CACHE_CONFIG.TTL_24_HOURS,
  });
}

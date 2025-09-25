import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CACHE_CONFIG } from "@/shared/constants/api";

// Mock the persister and window
const mockPersistQueryClient = vi.fn();
vi.mock("@tanstack/react-query-persist-client", () => ({
  persistQueryClient: mockPersistQueryClient,
}));

vi.mock("@/infrastructure/cache/StoragePersister", () => ({
  createSafeStoragePersister: vi.fn(() => ({
    persistClient: vi.fn(),
    restoreClient: vi.fn(),
    removeClient: vi.fn(),
  })),
}));

describe("queryClient", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset modules to ensure fresh imports
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original window
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
  });

  it("should create QueryClient with correct default options", async () => {
    const { queryClient } = await import("@/infrastructure/query/queryClient");

    expect(queryClient).toBeInstanceOf(QueryClient);

    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toBe(CACHE_CONFIG.TTL_24_HOURS);
    expect(defaultOptions.queries?.gcTime).toBe(CACHE_CONFIG.TTL_24_HOURS);
    expect(defaultOptions.queries?.retry).toBe(2);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaultOptions.queries?.refetchOnMount).toBe(false);

    expect(defaultOptions.mutations?.retry).toBe(1);
  });

  it("should configure persistence when window is available", async () => {
    // Mock window and localStorage
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(globalThis, "window", {
      value: {
        localStorage: mockLocalStorage,
      },
      writable: true,
    });

    // Import after setting up window mock
    await import("@/infrastructure/query/queryClient");

    expect(mockPersistQueryClient).toHaveBeenCalledWith({
      queryClient: expect.any(QueryClient),
      persister: expect.any(Object),
      maxAge: CACHE_CONFIG.TTL_24_HOURS,
    });
  });

  it("should not configure persistence when window is not available (SSR)", async () => {
    // Ensure window is undefined (SSR environment)
    Object.defineProperty(globalThis, "window", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    await import("@/infrastructure/query/queryClient");

    expect(mockPersistQueryClient).not.toHaveBeenCalled();
  });

  it("should use correct cache configuration values", () => {
    expect(CACHE_CONFIG.TTL_24_HOURS).toBe(24 * 60 * 60 * 1000); // 24 hours in ms
    expect(CACHE_CONFIG.MAX_RETRIES).toBe(3);
    expect(CACHE_CONFIG.EPISODES_LIMIT).toBe(20);
  });
});

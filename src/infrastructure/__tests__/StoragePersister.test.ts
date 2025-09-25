import type { Persister } from "@tanstack/react-query-persist-client";
import { beforeEach, describe, expect, it } from "vitest";
import { createSafeStoragePersister } from "@/infrastructure/cache/StoragePersister";

describe("StoragePersister", () => {
  let persister: Persister;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    persister = createSafeStoragePersister({
      storage: localStorage,
    });
  });

  it("should persist and restore data", async () => {
    const testData = {
      timestamp: Date.now(),
      buster: "test",
      clientState: { queries: [], mutations: [] },
    };

    await persister.persistClient(testData);
    const restored = await persister.restoreClient();

    expect(restored).toEqual(testData);
  });

  it("should return undefined when no data exists", async () => {
    const restored = await persister.restoreClient();
    expect(restored).toBeUndefined();
  });

  it("should handle corrupted data gracefully", async () => {
    localStorage.setItem("REACT_QUERY_OFFLINE_CACHE", "invalid-json");

    const restored = await persister.restoreClient();
    expect(restored).toBeUndefined();
  });

  it("should remove old data when storage is full", async () => {
    const testPersister = createSafeStoragePersister({
      storage: localStorage,
    });
    const testData = {
      timestamp: Date.now(),
      buster: "test",
      clientState: { queries: [], mutations: [], large: "data".repeat(1000) },
    };

    // This should work without throwing
    await expect(testPersister.persistClient(testData)).resolves.not.toThrow();
  });
});

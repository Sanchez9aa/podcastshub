import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchWithProxy } from "@/infrastructure/api/allOriginsProxy";

const mockFetch = vi.fn();
Object.defineProperty(globalThis, "fetch", { value: mockFetch });

describe("fetchWithProxy", () => {
  const TEST_URL = "https://example.com/api";
  const EXPECTED_PROXY_URL =
    "https://api.allorigins.win/get?url=https%3A%2F%2Fexample.com%2Fapi";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful requests", () => {
    it("should try direct fetch first and succeed", async () => {
      const expectedData = { podcastId: "123", title: "Test Podcast" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(expectedData),
      });

      const result = await fetchWithProxy<typeof expectedData>(TEST_URL);

      expect(mockFetch).toHaveBeenCalledWith(TEST_URL);
      expect(result).toEqual(expectedData);
    });

    it("should fallback to proxy when direct fetch fails", async () => {
      const expectedData = { podcastId: "123", title: "Test Podcast" };

      // First call (direct) fails
      mockFetch.mockRejectedValueOnce(new TypeError("CORS error"));

      // Second call (proxy) succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            contents: JSON.stringify(expectedData),
            status: { http_code: 200 },
          }),
      });

      const result = await fetchWithProxy<typeof expectedData>(TEST_URL);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(1, TEST_URL);
      expect(mockFetch).toHaveBeenNthCalledWith(2, EXPECTED_PROXY_URL);
      expect(result).toEqual(expectedData);
    });
  });

  describe("error handling", () => {
    it("should fail when both direct and proxy fail", async () => {
      // Direct fetch fails
      mockFetch.mockRejectedValueOnce(new TypeError("CORS error"));

      // Proxy fetch also fails
      mockFetch.mockRejectedValueOnce(new TypeError("Network error"));

      const error = (await fetchWithProxy(TEST_URL).catch((e) => e)) as Error;

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("AllOriginsProxyError");
      expect(error.message).toContain("Proxy error: Network error");
    });

    it("should handle HTTP error responses from direct fetch and fallback to proxy", async () => {
      const expectedData = { podcastId: "123", title: "Test Podcast" };

      // Direct fetch fails with 404
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      // Proxy succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            contents: JSON.stringify(expectedData),
            status: { http_code: 200 },
          }),
      });

      const result = await fetchWithProxy(TEST_URL);
      expect(result).toEqual(expectedData);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should handle proxy-specific errors like missing contents", async () => {
      // Direct fetch fails
      mockFetch.mockRejectedValueOnce(new TypeError("CORS error"));

      // Proxy returns response without contents
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: { http_code: 200 } }),
      });

      await expect(fetchWithProxy(TEST_URL)).rejects.toMatchObject({
        name: "AllOriginsProxyError",
        message: expect.stringContaining("No contents in proxy response"),
      });
    });

    it("should handle invalid JSON in proxy response contents", async () => {
      // Direct fetch fails
      mockFetch.mockRejectedValueOnce(new TypeError("CORS error"));

      const mockResponse = {
        contents: "invalid-json-{malformed",
        status: { http_code: 200 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(fetchWithProxy(TEST_URL)).rejects.toMatchObject({
        name: "AllOriginsProxyError",
        message: expect.stringContaining("Failed to parse JSON"),
      });
    });
  });
});

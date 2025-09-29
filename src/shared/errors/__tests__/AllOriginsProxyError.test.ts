import { describe, expect, it } from "vitest";
import { AllOriginsProxyError } from "../AllOriginsProxyError";

describe("AllOriginsProxyError", () => {
  describe("constructor", () => {
    it("should create error with direct method", () => {
      const originalUrl = "https://example.com/api/data";
      const message = "Failed to fetch data";
      const error = new AllOriginsProxyError(message, originalUrl, "direct");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AllOriginsProxyError);
      expect(error.name).toBe("AllOriginsProxyError");
      expect(error.originalUrl).toBe(originalUrl);
      expect(error.method).toBe("direct");
      expect(error.message).toBe(
        "API Error (direct): Failed to fetch data (URL: https://example.com/api/data)",
      );
    });

    it("should create error with proxy method", () => {
      const originalUrl = "https://api.podcast.com/episodes";
      const message = "Proxy request failed";
      const error = new AllOriginsProxyError(message, originalUrl, "proxy");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AllOriginsProxyError);
      expect(error.name).toBe("AllOriginsProxyError");
      expect(error.originalUrl).toBe(originalUrl);
      expect(error.method).toBe("proxy");
      expect(error.message).toBe(
        "API Error (proxy): Proxy request failed (URL: https://api.podcast.com/episodes)",
      );
    });

    it("should handle empty message", () => {
      const originalUrl = "https://example.com";
      const error = new AllOriginsProxyError("", originalUrl, "direct");

      expect(error.message).toBe(
        "API Error (direct):  (URL: https://example.com)",
      );
      expect(error.originalUrl).toBe(originalUrl);
      expect(error.method).toBe("direct");
    });

    it("should handle empty URL", () => {
      const message = "Network error";
      const error = new AllOriginsProxyError(message, "", "proxy");

      expect(error.message).toBe("API Error (proxy): Network error (URL: )");
      expect(error.originalUrl).toBe("");
      expect(error.method).toBe("proxy");
    });

    it("should handle special characters in message", () => {
      const originalUrl = "https://example.com/test";
      const message = "Error: 404 - Not Found! (Check your URL)";
      const error = new AllOriginsProxyError(message, originalUrl, "direct");

      expect(error.message).toBe(
        "API Error (direct): Error: 404 - Not Found! (Check your URL) (URL: https://example.com/test)",
      );
    });

    it("should handle special characters in URL", () => {
      const originalUrl =
        "https://example.com/api?query=test&limit=10&sort=asc";
      const message = "Query failed";
      const error = new AllOriginsProxyError(message, originalUrl, "proxy");

      expect(error.message).toBe(
        "API Error (proxy): Query failed (URL: https://example.com/api?query=test&limit=10&sort=asc)",
      );
      expect(error.originalUrl).toBe(originalUrl);
    });
  });

  describe("properties", () => {
    it("should have readonly originalUrl property", () => {
      const originalUrl = "https://test.com";
      const error = new AllOriginsProxyError("test", originalUrl, "direct");

      expect(error.originalUrl).toBe(originalUrl);

      // Property exists and is accessible
      expect(error).toHaveProperty("originalUrl");
    });

    it("should have readonly method property", () => {
      const error = new AllOriginsProxyError(
        "test",
        "https://test.com",
        "proxy",
      );

      expect(error.method).toBe("proxy");

      // Property exists and is accessible
      expect(error).toHaveProperty("method");
    });

    it("should inherit Error properties", () => {
      const error = new AllOriginsProxyError(
        "test message",
        "https://test.com",
        "direct",
      );

      expect(error.name).toBe("AllOriginsProxyError");
      expect(error.message).toContain("test message");
      expect(error.stack).toBeDefined();
    });
  });

  describe("error handling scenarios", () => {
    it("should work with try-catch blocks", () => {
      const originalUrl = "https://api.example.com/podcasts";
      let caughtError: AllOriginsProxyError | null = null;

      try {
        throw new AllOriginsProxyError(
          "Connection timeout",
          originalUrl,
          "direct",
        );
      } catch (error) {
        caughtError = error as AllOriginsProxyError;
      }

      expect(caughtError).toBeInstanceOf(AllOriginsProxyError);
      expect(caughtError?.originalUrl).toBe(originalUrl);
      expect(caughtError?.method).toBe("direct");
    });

    it("should be throwable and catchable", () => {
      const throwError = () => {
        throw new AllOriginsProxyError(
          "Test error",
          "https://test.com",
          "proxy",
        );
      };

      expect(throwError).toThrow(AllOriginsProxyError);
      expect(throwError).toThrow(
        "API Error (proxy): Test error (URL: https://test.com)",
      );
    });

    it("should work with Promise.reject", async () => {
      const originalUrl = "https://api.test.com";
      const promise = Promise.reject(
        new AllOriginsProxyError("Async error", originalUrl, "proxy"),
      );

      await expect(promise).rejects.toBeInstanceOf(AllOriginsProxyError);
      await expect(promise).rejects.toMatchObject({
        originalUrl,
        method: "proxy",
        name: "AllOriginsProxyError",
      });
    });
  });

  describe("real-world usage scenarios", () => {
    it("should handle iTunes API error", () => {
      const iTunesUrl =
        "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";
      const error = new AllOriginsProxyError(
        "Failed to fetch top podcasts from iTunes API",
        iTunesUrl,
        "direct",
      );

      expect(error.originalUrl).toBe(iTunesUrl);
      expect(error.method).toBe("direct");
      expect(error.message).toContain("iTunes API");
    });

    it("should handle AllOrigins proxy error", () => {
      const originalUrl = "https://itunes.apple.com/lookup?id=123456";
      const error = new AllOriginsProxyError(
        "Proxy service unavailable",
        originalUrl,
        "proxy",
      );

      expect(error.originalUrl).toBe(originalUrl);
      expect(error.method).toBe("proxy");
      expect(error.message).toContain("Proxy service unavailable");
    });

    it("should handle CORS error", () => {
      const apiUrl = "https://podcast-api.example.com/episodes";
      const error = new AllOriginsProxyError(
        "CORS policy blocked the request",
        apiUrl,
        "direct",
      );

      expect(error.message).toContain("CORS policy");
      expect(error.originalUrl).toBe(apiUrl);
      expect(error.method).toBe("direct");
    });

    it("should handle network timeout", () => {
      const apiUrl = "https://slow-api.example.com/data";
      const error = new AllOriginsProxyError(
        "Request timeout after 10 seconds",
        apiUrl,
        "proxy",
      );

      expect(error.message).toContain("timeout");
      expect(error.originalUrl).toBe(apiUrl);
      expect(error.method).toBe("proxy");
    });

    it("should handle 404 not found", () => {
      const apiUrl = "https://api.example.com/podcast/999999";
      const error = new AllOriginsProxyError(
        "Podcast not found (404)",
        apiUrl,
        "direct",
      );

      expect(error.message).toContain("404");
      expect(error.originalUrl).toBe(apiUrl);
    });

    it("should handle malformed JSON response", () => {
      const apiUrl = "https://api.example.com/podcasts.json";
      const error = new AllOriginsProxyError(
        "Response is not valid JSON",
        apiUrl,
        "proxy",
      );

      expect(error.message).toContain("JSON");
      expect(error.originalUrl).toBe(apiUrl);
    });
  });

  describe("error serialization", () => {
    it("should work with JSON.stringify", () => {
      const error = new AllOriginsProxyError(
        "Serialization test",
        "https://test.com",
        "direct",
      );

      // Error objects don't serialize well by default, but we can create a serializable version
      const serializable = {
        name: error.name,
        message: error.message,
        originalUrl: error.originalUrl,
        method: error.method,
      };

      const serialized = JSON.stringify(serializable);
      const parsed = JSON.parse(serialized);

      expect(parsed.name).toBe("AllOriginsProxyError");
      expect(parsed.message).toContain("Serialization test");
      expect(parsed.originalUrl).toBe("https://test.com");
      expect(parsed.method).toBe("direct");
    });

    it("should preserve stack trace", () => {
      const error = new AllOriginsProxyError(
        "Stack test",
        "https://test.com",
        "proxy",
      );

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("AllOriginsProxyError");
    });
  });

  describe("error comparison", () => {
    it("should be equal to itself", () => {
      const error = new AllOriginsProxyError(
        "test",
        "https://test.com",
        "direct",
      );

      expect(error).toBe(error);
      // Verify object identity
      expect(Object.is(error, error)).toBe(true);
    });

    it("should not be equal to different error instances", () => {
      const error1 = new AllOriginsProxyError(
        "test",
        "https://test.com",
        "direct",
      );
      const error2 = new AllOriginsProxyError(
        "test",
        "https://test.com",
        "direct",
      );

      expect(error1).not.toBe(error2);
      expect(error1 === error2).toBe(false);
    });

    it("should have same properties for identical parameters", () => {
      const message = "identical test";
      const url = "https://identical.com";
      const method = "proxy";

      const error1 = new AllOriginsProxyError(message, url, method);
      const error2 = new AllOriginsProxyError(message, url, method);

      expect(error1.message).toBe(error2.message);
      expect(error1.originalUrl).toBe(error2.originalUrl);
      expect(error1.method).toBe(error2.method);
      expect(error1.name).toBe(error2.name);
    });
  });

  describe("edge cases", () => {
    it("should handle very long URL", () => {
      const longUrl = `https://example.com/${"a".repeat(1000)}`;
      const error = new AllOriginsProxyError(
        "Long URL test",
        longUrl,
        "direct",
      );

      expect(error.originalUrl).toBe(longUrl);
      expect(error.message).toContain(longUrl);
    });

    it("should handle very long message", () => {
      const longMessage = `Error: ${"x".repeat(1000)}`;
      const error = new AllOriginsProxyError(
        longMessage,
        "https://test.com",
        "proxy",
      );

      expect(error.message).toContain(longMessage);
    });

    it("should handle unicode characters", () => {
      const unicodeMessage = "Error with unicode: 🚫 ❌ 错误";
      const unicodeUrl = "https://测试.com/api/数据";
      const error = new AllOriginsProxyError(
        unicodeMessage,
        unicodeUrl,
        "direct",
      );

      expect(error.message).toContain(unicodeMessage);
      expect(error.originalUrl).toBe(unicodeUrl);
    });

    it("should handle null-like strings", () => {
      const error1 = new AllOriginsProxyError("null", "null", "direct");
      const error2 = new AllOriginsProxyError(
        "undefined",
        "undefined",
        "proxy",
      );

      expect(error1.originalUrl).toBe("null");
      expect(error1.message).toContain("null");
      expect(error2.originalUrl).toBe("undefined");
      expect(error2.message).toContain("undefined");
    });
  });

  describe("inheritance", () => {
    it("should be instance of Error", () => {
      const error = new AllOriginsProxyError(
        "test",
        "https://test.com",
        "direct",
      );

      expect(error instanceof Error).toBe(true);
      expect(error instanceof AllOriginsProxyError).toBe(true);
    });

    it("should work with instanceof checks", () => {
      const error = new AllOriginsProxyError(
        "test",
        "https://test.com",
        "proxy",
      );

      expect(error instanceof Error).toBe(true);
      expect(error instanceof AllOriginsProxyError).toBe(true);
      expect(error instanceof TypeError).toBe(false);
      expect(error instanceof ReferenceError).toBe(false);
    });

    it("should have Error constructor in prototype chain", () => {
      const error = new AllOriginsProxyError(
        "test",
        "https://test.com",
        "direct",
      );

      expect(Object.getPrototypeOf(error)).toBe(AllOriginsProxyError.prototype);
      expect(Object.getPrototypeOf(AllOriginsProxyError.prototype)).toBe(
        Error.prototype,
      );
    });
  });
});

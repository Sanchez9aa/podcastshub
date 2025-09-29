import { describe, expect, it } from "vitest";
import {
  getBasePath,
  getEnvironment,
  isDevelopment,
  isProduction,
  isTest,
} from "../environment";

describe("Environment utilities", () => {
  describe("getBasePath", () => {
    it("should return a valid path string", () => {
      const path = getBasePath();
      expect(typeof path).toBe("string");
      expect(path.length).toBeGreaterThan(0);
      expect(path.startsWith("/")).toBe(true);
      expect(path.endsWith("/")).toBe(true);
    });

    it("should return consistent path between calls", () => {
      const path1 = getBasePath();
      const path2 = getBasePath();
      expect(path1).toBe(path2);
    });

    it("should return either root path or podcastshub path", () => {
      const path = getBasePath();
      expect(path === "/" || path === "/podcastshub/").toBe(true);
    });
  });

  describe("getEnvironment", () => {
    it("should return a valid environment", () => {
      const env = getEnvironment();
      expect(["development", "production", "test"]).toContain(env);
    });

    it("should return consistent environment between calls", () => {
      const env1 = getEnvironment();
      const env2 = getEnvironment();
      expect(env1).toBe(env2);
    });
  });

  describe("environment flags", () => {
    it("should return boolean values", () => {
      expect(typeof isProduction()).toBe("boolean");
      expect(typeof isDevelopment()).toBe("boolean");
      expect(typeof isTest()).toBe("boolean");
    });

    it("should have only one environment flag true", () => {
      const flags = [isProduction(), isDevelopment(), isTest()];
      const trueCount = flags.filter((flag) => flag).length;
      expect(trueCount).toBe(1);
    });

    it("should match getEnvironment result", () => {
      const env = getEnvironment();

      if (env === "production") {
        expect(isProduction()).toBe(true);
        expect(isDevelopment()).toBe(false);
        expect(isTest()).toBe(false);
      } else if (env === "development") {
        expect(isProduction()).toBe(false);
        expect(isDevelopment()).toBe(true);
        expect(isTest()).toBe(false);
      } else if (env === "test") {
        expect(isProduction()).toBe(false);
        expect(isDevelopment()).toBe(false);
        expect(isTest()).toBe(true);
      }
    });
  });

  describe("integration behavior", () => {
    it("should provide consistent configuration for routing", () => {
      const basePath = getBasePath();

      // BasePath should be valid for BrowserRouter
      expect(basePath.startsWith("/")).toBe(true);

      // For router basename, we remove trailing slash
      const routerBasename = basePath.slice(0, -1);
      expect(routerBasename === "" || routerBasename.startsWith("/")).toBe(
        true,
      );
    });

    it("should work for current test environment", () => {
      // In test environment, we expect safe defaults
      expect(isTest()).toBe(true);
      expect(getBasePath()).toBe("/");
      expect(getEnvironment()).toBe("test");
    });

    it("should provide all utility functions", () => {
      // Smoke test - all functions should be callable
      expect(typeof getBasePath()).toBe("string");
      expect(typeof getEnvironment()).toBe("string");
      expect(typeof isProduction()).toBe("boolean");
      expect(typeof isDevelopment()).toBe("boolean");
      expect(typeof isTest()).toBe("boolean");
    });
  });
});

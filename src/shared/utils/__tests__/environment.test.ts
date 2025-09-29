import { describe, expect, it } from "vitest";
import { formatDate } from "../formatDate";
import { formatDuration } from "../formatDuration";
import { sanitizeHtml } from "../sanitizeHtml";

/**
 * Environment agnostic tests to ensure utilities work across different platforms
 * These tests focus on behavior rather than exact output formatting
 */
describe("Environment Agnostic Utility Tests", () => {
  describe("formatDate cross-environment", () => {
    it("should handle basic date formatting consistently", () => {
      const validDates = ["2024-01-15", "2024-12-31", "2023-06-15"];

      validDates.forEach((date) => {
        const result = formatDate(date);

        // Should always return a non-empty string for valid dates
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);

        // Should contain the year somewhere in the result
        expect(result).toMatch(/202[3-4]/);

        // Should contain some date separators (could be /, -, or spaces)
        expect(result).toMatch(/[\\/\-\s]/);
      });
    });

    it("should handle invalid dates consistently", () => {
      const invalidDates = [
        "invalid-date",
        "not-a-date",
        "abc123",
        "2024-99-99",
      ];

      invalidDates.forEach((invalidDate) => {
        const result = formatDate(invalidDate);

        // Should return a string (could be "Invalid Date", "NaN/NaN/NaN", etc.)
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);

        // Should not contain valid year numbers for truly invalid dates
        expect(result).not.toMatch(/^202[0-9]$/);
      });
    });

    it("should handle empty inputs consistently", () => {
      expect(formatDate("")).toBe("");
      expect(formatDate(null as unknown as string)).toBe("");
      expect(formatDate(undefined as unknown as string)).toBe("");
    });
  });

  describe("formatDuration cross-environment", () => {
    it("should format durations consistently across environments", () => {
      const testCases = [
        { input: 0, expected: "00:00" },
        { input: 30, expected: "00:30" },
        { input: 60, expected: "01:00" },
        { input: 3600, expected: "01:00:00" },
        { input: 3661, expected: "01:01:01" },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatDuration(input)).toBe(expected);
      });
    });

    it("should handle invalid inputs consistently", () => {
      const invalidInputs = [null, undefined, NaN];

      invalidInputs.forEach((input) => {
        expect(formatDuration(input as unknown as number)).toBe("--:--");
      });
    });

    it("should handle edge cases consistently", () => {
      expect(formatDuration(-1)).toBe("00:00");
      expect(formatDuration(0.5)).toBe("00:00");
      expect(formatDuration(59.9)).toBe("00:59");
    });
  });

  describe("sanitizeHtml cross-environment", () => {
    it("should preserve safe HTML consistently", () => {
      const safeHTML = "<p>Safe <strong>content</strong> here</p>";
      const result = sanitizeHtml(safeHTML);

      // Should preserve basic structure
      expect(result).toContain("<p>");
      expect(result).toContain("</p>");
      expect(result).toContain("<strong>");
      expect(result).toContain("</strong>");
      expect(result).toContain("Safe");
      expect(result).toContain("content");
      expect(result).toContain("here");
    });

    it("should remove dangerous content consistently", () => {
      const dangerousHTML = '<script>alert("xss")</script><p>Safe content</p>';
      const result = sanitizeHtml(dangerousHTML);

      // Should remove dangerous elements
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("alert");
      expect(result).not.toContain("xss");

      // Should preserve safe content
      expect(result).toContain("Safe content");
    });

    it("should handle empty inputs consistently", () => {
      expect(sanitizeHtml("")).toBe("");
      expect(sanitizeHtml(null as unknown as string)).toBe("");
      expect(sanitizeHtml(undefined as unknown as string)).toBe("");
    });

    it("should handle plain text consistently", () => {
      const plainText = "Just plain text without HTML";
      expect(sanitizeHtml(plainText)).toBe(plainText);
    });

    it("should preserve allowed attributes", () => {
      const htmlWithLinks =
        '<p>Visit <a href="https://example.com">our site</a></p>';
      const result = sanitizeHtml(htmlWithLinks);

      expect(result).toContain('href="https://example.com"');
      expect(result).toContain("our site");
    });
  });

  describe("Integration behavior", () => {
    it("should work together for podcast data processing", () => {
      // Simulate real podcast data processing
      const podcastEpisode = {
        title: "Test Episode",
        description:
          '<p>This is a <strong>test</strong> episode with <a href="https://example.com">links</a>.</p>',
        duration: 3725, // 1:02:05
        releaseDate: "2024-01-15T10:30:00Z",
      };

      // Process the data
      const sanitizedDescription = sanitizeHtml(podcastEpisode.description);
      const formattedDuration = formatDuration(podcastEpisode.duration);
      const formattedDate = formatDate(podcastEpisode.releaseDate);

      // Verify results are reasonable
      expect(sanitizedDescription).toContain("test");
      expect(sanitizedDescription).toContain("episode");
      expect(sanitizedDescription).toContain("<strong>");

      expect(formattedDuration).toBe("01:02:05");

      expect(formattedDate).toBeTruthy();
      expect(formattedDate).toContain("2024");
    });
  });
});

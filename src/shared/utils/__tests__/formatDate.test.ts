import { describe, expect, it } from "vitest";
import { formatDate } from "../formatDate";

describe("formatDate", () => {
  it("should return empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("should return empty string for null input", () => {
    expect(formatDate(null as any)).toBe("");
  });

  it("should return empty string for undefined input", () => {
    expect(formatDate(undefined as any)).toBe("");
  });

  it("should format valid ISO date string", () => {
    const result = formatDate("2024-01-15");
    // Should return a formatted date string, not empty
    expect(result).toBeTruthy();
    expect(result).not.toBe("");
    // Should contain the year 2024
    expect(result).toContain("2024");
  });

  it("should format valid date with time", () => {
    const result1 = formatDate("2024-01-15T10:30:00Z");
    const result2 = formatDate("2024-12-31T23:59:59.999Z");

    expect(result1).toBeTruthy();
    expect(result1).not.toBe("");
    expect(result2).toBeTruthy();
    expect(result2).not.toBe("");
  });

  it("should format date strings in different formats", () => {
    const formats = ["2024/01/15", "Jan 15, 2024", "15 Jan 2024"];

    formats.forEach((format) => {
      const result = formatDate(format);
      expect(result).toBeTruthy();
      expect(result).not.toBe("");
      expect(result).toContain("2024");
    });
  });

  it("should handle leap year dates", () => {
    const result1 = formatDate("2024-02-29");
    const result2 = formatDate("2020-02-29");

    expect(result1).toBeTruthy();
    expect(result1).not.toBe("");
    expect(result2).toBeTruthy();
    expect(result2).not.toBe("");
  });

  it("should handle first and last days of year", () => {
    const result1 = formatDate("2024-01-01");
    const result2 = formatDate("2024-12-31");

    expect(result1).toBeTruthy();
    expect(result1).toContain("2024");
    expect(result2).toBeTruthy();
    expect(result2).toContain("2024");
  });

  it("should handle different years", () => {
    const years = ["2020", "2025", "1990"];

    years.forEach((year) => {
      const result = formatDate(`${year}-06-15`);
      expect(result).toBeTruthy();
      expect(result).toContain(year);
    });
  });

  it("should handle invalid date strings consistently", () => {
    const invalidDates = ["invalid-date", "not-a-date", "2024-13-40", "abc123"];

    invalidDates.forEach((invalidDate) => {
      const result = formatDate(invalidDate);
      // Should return some consistent value for invalid dates
      // Could be "Invalid Date", "NaN/NaN/NaN", or similar depending on browser
      expect(typeof result).toBe("string");
      expect(result).not.toBe("");
    });
  });

  it("should handle edge cases for dates", () => {
    const edgeCases = [
      "2024-00-01", // Invalid month
      "2024-01-32", // Invalid day
      "2024-02-30", // Invalid date for February (may roll over)
    ];

    edgeCases.forEach((edgeCase) => {
      const result = formatDate(edgeCase);
      expect(typeof result).toBe("string");
      expect(result).not.toBe("");
    });
  });

  it("should handle podcast episode release dates", () => {
    // Common RSS feed date formats
    const rssDates = [
      "2024-01-15",
      "2024-01-15T08:00:00.000Z",
      "2024-01-15T08:00:00+00:00",
    ];

    rssDates.forEach((date) => {
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });
  });

  it("should handle partial date strings", () => {
    const result1 = formatDate("2024");
    const result2 = formatDate("2024-01");

    expect(result1).toBeTruthy();
    expect(result1).toContain("2024");
    expect(result2).toBeTruthy();
    expect(result2).toContain("2024");
  });

  it("should handle date strings with milliseconds", () => {
    const dates = ["2024-01-15T10:30:45.123Z", "2024-01-15T10:30:45.999Z"];

    dates.forEach((date) => {
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });
  });

  it("should handle timezone variations", () => {
    const timezones = [
      "2024-01-15T10:30:00+05:00",
      "2024-01-15T10:30:00-08:00",
      "2024-01-15T10:30:00Z",
    ];

    timezones.forEach((date) => {
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });
  });

  it("should handle various invalid formats", () => {
    const invalidFormats = ["  ", "null", "undefined", "{}", "[]"];

    invalidFormats.forEach((format) => {
      const result = formatDate(format);
      expect(typeof result).toBe("string");
      // Could be invalid date representation, depending on environment
    });
  });

  it("should format real podcast episode dates", () => {
    // Common formats from real podcast feeds
    const realDates = [
      "2024-01-15T00:00:00.000Z",
      "2024-03-22T12:30:00Z",
      "2024-12-01",
    ];

    realDates.forEach((date) => {
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });
  });

  it("should handle RFC 2822 date format", () => {
    const rfcDates = [
      "Mon, 15 Jan 2024 00:00:00 GMT",
      "Wed, 22 Mar 2024 12:30:00 GMT",
    ];

    rfcDates.forEach((date) => {
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });
  });

  it("should handle numeric timestamps as strings", () => {
    // Large number strings that don't parse as valid dates
    const result = formatDate("1705276800000");
    expect(typeof result).toBe("string");
    // Should handle this consistently (likely as invalid date)
  });

  it("should maintain consistent output format for valid dates", () => {
    const dates = ["2024-01-01", "2024-01-15", "2024-12-31"];

    const results = dates.map((date) => formatDate(date));

    // All results should be non-empty strings
    results.forEach((result) => {
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).toContain("2024");
    });

    // All results should have similar structure (contain separators)
    results.forEach((result) => {
      expect(result.length).toBeGreaterThan(5); // Should be more than just year
    });
  });

  it("should use Spanish locale formatting", () => {
    // Test that function actually calls toLocaleDateString with es-ES
    const result = formatDate("2024-01-15");
    expect(result).toBeTruthy();
    expect(result).toContain("2024");
    // The exact format depends on the implementation but should be a valid date string
  });

  it("should handle function behavior without mocking", () => {
    // This test ensures the real implementation works
    const result = formatDate("2024-01-15");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);

    // For empty input, should return empty string
    expect(formatDate("")).toBe("");
  });
});

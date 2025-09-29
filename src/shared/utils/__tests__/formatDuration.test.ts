import { describe, expect, it, vi } from "vitest";
import { formatDuration } from "../formatDuration";

describe("formatDuration", () => {
  it("should return '--:--' for null input", () => {
    expect(formatDuration(null as unknown as number)).toBe("--:--");
  });

  it("should return '--:--' for undefined input", () => {
    expect(formatDuration(undefined as unknown as number)).toBe("--:--");
  });

  it("should return '--:--' for NaN input", () => {
    expect(formatDuration(NaN)).toBe("--:--");
  });

  it("should log warning for invalid duration values", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    formatDuration(null as unknown as number);
    expect(consoleSpy).toHaveBeenCalledWith(
      "formatDuration: Invalid duration value received:",
      null,
    );

    formatDuration(NaN);
    expect(consoleSpy).toHaveBeenCalledWith(
      "formatDuration: Invalid duration value received:",
      NaN,
    );

    consoleSpy.mockRestore();
  });

  it("should return '00:00' for zero seconds", () => {
    expect(formatDuration(0)).toBe("00:00");
  });

  it("should return '00:00' for negative seconds", () => {
    expect(formatDuration(-10)).toBe("00:00");
    expect(formatDuration(-1)).toBe("00:00");
  });

  it("should format seconds only (less than 60 seconds)", () => {
    expect(formatDuration(30)).toBe("00:30");
    expect(formatDuration(59)).toBe("00:59");
    expect(formatDuration(5)).toBe("00:05");
    expect(formatDuration(1)).toBe("00:01");
  });

  it("should format minutes and seconds (less than 1 hour)", () => {
    expect(formatDuration(60)).toBe("01:00");
    expect(formatDuration(90)).toBe("01:30");
    expect(formatDuration(300)).toBe("05:00");
    expect(formatDuration(3599)).toBe("59:59");
    expect(formatDuration(125)).toBe("02:05");
  });

  it("should format hours, minutes and seconds (1 hour or more)", () => {
    expect(formatDuration(3600)).toBe("01:00:00");
    expect(formatDuration(3661)).toBe("01:01:01");
    expect(formatDuration(7200)).toBe("02:00:00");
    expect(formatDuration(7890)).toBe("02:11:30");
    expect(formatDuration(36000)).toBe("10:00:00");
  });

  it("should handle large durations correctly", () => {
    expect(formatDuration(86400)).toBe("24:00:00"); // 24 hours
    expect(formatDuration(90061)).toBe("25:01:01"); // 25 hours, 1 minute, 1 second
  });

  it("should handle floating point seconds by flooring", () => {
    expect(formatDuration(59.9)).toBe("00:59");
    expect(formatDuration(60.1)).toBe("01:00");
    expect(formatDuration(125.7)).toBe("02:05");
    expect(formatDuration(3661.5)).toBe("01:01:01");
  });

  it("should pad single digits with zeros", () => {
    expect(formatDuration(5)).toBe("00:05");
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(3605)).toBe("01:00:05");
    expect(formatDuration(3665)).toBe("01:01:05");
  });

  it("should handle typical podcast episode durations", () => {
    expect(formatDuration(1800)).toBe("30:00"); // 30 minutes
    expect(formatDuration(2700)).toBe("45:00"); // 45 minutes
    expect(formatDuration(3600)).toBe("01:00:00"); // 1 hour
    expect(formatDuration(5400)).toBe("01:30:00"); // 1.5 hours
    expect(formatDuration(7200)).toBe("02:00:00"); // 2 hours
  });

  it("should handle edge cases with exact minute/hour boundaries", () => {
    expect(formatDuration(60)).toBe("01:00"); // exactly 1 minute
    expect(formatDuration(120)).toBe("02:00"); // exactly 2 minutes
    expect(formatDuration(3600)).toBe("01:00:00"); // exactly 1 hour
    expect(formatDuration(7200)).toBe("02:00:00"); // exactly 2 hours
  });

  it("should handle very short durations", () => {
    expect(formatDuration(0.1)).toBe("00:00");
    expect(formatDuration(0.9)).toBe("00:00");
    expect(formatDuration(1)).toBe("00:01");
  });

  it("should handle durations from real podcast scenarios", () => {
    // Common episode lengths
    expect(formatDuration(1234)).toBe("20:34"); // ~20 minutes
    expect(formatDuration(2546)).toBe("42:26"); // ~42 minutes
    expect(formatDuration(4567)).toBe("01:16:07"); // ~1 hour 16 minutes
    expect(formatDuration(8901)).toBe("02:28:21"); // ~2.5 hours
  });

  it("should handle string numbers correctly when converted", () => {
    expect(formatDuration(Number("60"))).toBe("01:00");
    expect(formatDuration(Number("3600"))).toBe("01:00:00");
  });

  it("should maintain consistent formatting across different input types", () => {
    const duration = 3725; // 1:02:05
    expect(formatDuration(duration)).toBe("01:02:05");
    expect(formatDuration(Math.floor(duration))).toBe("01:02:05");
    expect(formatDuration(parseInt(duration.toString(), 10))).toBe("01:02:05");
  });
});

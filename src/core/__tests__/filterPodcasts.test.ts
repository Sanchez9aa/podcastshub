import { describe, expect, it } from "vitest";
import { filterPodcasts } from "@/core/use-cases/filterPodcasts";
import { mockPodcasts } from "@/test/fixtures/podcastFixtures";

describe("filterPodcasts", () => {
  it("should filter podcasts by name", () => {
    const result = filterPodcasts(mockPodcasts, "Tech");
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Tech Talk");
    expect(result[1].name).toBe("Tech News");
  });

  it("should filter podcasts by artist", () => {
    const result = filterPodcasts(mockPodcasts, "Jane");
    expect(result).toHaveLength(1);
    expect(result[0].artist).toBe("Jane Smith");
  });

  it("should be case insensitive", () => {
    const result = filterPodcasts(mockPodcasts, "TECH");
    expect(result).toHaveLength(2);
  });

  it("should return all podcasts when filter is empty", () => {
    const result = filterPodcasts(mockPodcasts, "");
    expect(result).toHaveLength(3);
  });

  it("should return empty array when no matches", () => {
    const result = filterPodcasts(mockPodcasts, "NonExistent");
    expect(result).toHaveLength(0);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import * as allOriginsProxy from "@/infrastructure/api/allOriginsProxy";
import { apiPodcastRepository } from "@/infrastructure/repositories/ApiPodcastRepository";
import { API_ENDPOINTS } from "@/shared/constants/api";
import {
  expectedMappedPodcastDetail,
  expectedMappedPodcasts,
  mockEmptyiTunesLookupResponse,
  mockiTunesApiResponse,
  mockiTunesLookupResponse,
  mockiTunesLookupResponseMissingFields,
  mockiTunesLookupResponseNoEpisodes,
} from "@/test/fixtures/iTunesApiFixtures";

// Mock the allOriginsProxy module
vi.mock("@/infrastructure/api/allOriginsProxy", () => ({
  fetchWithProxy: vi.fn(),
}));

const mockFetchWithProxy = vi.mocked(allOriginsProxy.fetchWithProxy);

describe("ApiPodcastRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPodcasts", () => {
    it("should return mapped podcasts from iTunes API", async () => {
      // Arrange
      mockFetchWithProxy.mockResolvedValue(mockiTunesApiResponse);

      // Act
      const result = await apiPodcastRepository.getPodcasts();

      // Assert
      expect(mockFetchWithProxy).toHaveBeenCalledWith(
        API_ENDPOINTS.TOP_PODCASTS,
      );
      expect(result).toEqual(expectedMappedPodcasts);
    });

    it("should throw error when API call fails", async () => {
      // Arrange
      const error = new Error("Network error");
      mockFetchWithProxy.mockRejectedValue(error);

      // Act & Assert
      await expect(apiPodcastRepository.getPodcasts()).rejects.toThrow(
        "Network error",
      );
      expect(mockFetchWithProxy).toHaveBeenCalledWith(
        API_ENDPOINTS.TOP_PODCASTS,
      );
    });

    it("should log error to console when API call fails", async () => {
      // Arrange
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const error = new Error("Network error");
      mockFetchWithProxy.mockRejectedValue(error);

      // Act
      try {
        await apiPodcastRepository.getPodcasts();
      } catch {
        // Expected to throw
      }

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch podcasts:",
        error,
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getPodcastDetail", () => {
    it("should return podcast detail with episodes", async () => {
      // Arrange
      const podcastId = "1574007634";
      mockFetchWithProxy.mockResolvedValue(mockiTunesLookupResponse);

      // Act
      const result = await apiPodcastRepository.getPodcastDetail(podcastId);

      // Assert
      expect(mockFetchWithProxy).toHaveBeenCalledWith(
        API_ENDPOINTS.PODCAST_DETAIL.replace("{PODCAST_ID}", podcastId),
      );
      expect(result).toEqual(expectedMappedPodcastDetail);
    });

    it("should handle missing optional fields gracefully", async () => {
      // Arrange
      const podcastId = "999";
      mockFetchWithProxy.mockResolvedValue(
        mockiTunesLookupResponseMissingFields,
      );

      // Act
      const result = await apiPodcastRepository.getPodcastDetail(podcastId);

      // Assert
      expect(result).toEqual({
        id: "999",
        name: "",
        artist: "",
        summary: "",
        image: "",
        trackCount: 1,
        episodes: [
          {
            id: "1001",
            title: "",
            description: "",
            audioUrl: "",
            duration: 0,
            releaseDate: "",
            podcastId,
          },
        ],
      });
    });

    it("should throw error when no results are found", async () => {
      // Arrange
      const podcastId = "999";
      mockFetchWithProxy.mockResolvedValue(mockEmptyiTunesLookupResponse);

      // Act & Assert
      await expect(
        apiPodcastRepository.getPodcastDetail(podcastId),
      ).rejects.toThrow(`Podcast with ID ${podcastId} not found`);
    });

    it("should throw error when API call fails", async () => {
      // Arrange
      const podcastId = "123";
      const error = new Error("Network error");
      mockFetchWithProxy.mockRejectedValue(error);

      // Act & Assert
      await expect(
        apiPodcastRepository.getPodcastDetail(podcastId),
      ).rejects.toThrow("Network error");

      expect(mockFetchWithProxy).toHaveBeenCalledWith(
        API_ENDPOINTS.PODCAST_DETAIL.replace("{PODCAST_ID}", podcastId),
      );
    });

    it("should log error to console when API call fails", async () => {
      // Arrange
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const podcastId = "123";
      const error = new Error("Network error");
      mockFetchWithProxy.mockRejectedValue(error);

      // Act
      try {
        await apiPodcastRepository.getPodcastDetail(podcastId);
      } catch {
        // Expected to throw
      }

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to fetch podcast detail for ID ${podcastId}:`,
        error,
      );
      consoleSpy.mockRestore();
    });

    it("should handle podcast with no episodes", async () => {
      // Arrange
      const podcastId = "1234567890";
      mockFetchWithProxy.mockResolvedValue(mockiTunesLookupResponseNoEpisodes);

      // Act
      const result = await apiPodcastRepository.getPodcastDetail(podcastId);

      // Assert
      expect(result.episodes).toHaveLength(0);
      expect(result.trackCount).toBe(0);
      expect(result.name).toBe("Brand New Podcast");
      expect(result.artist).toBe("New Podcaster");
    });
  });
});

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Podcast } from "@/core/entities/Podcast";
import { createLargePodcastList } from "@/test/fixtures/hookFixtures";
import { mockPodcasts } from "@/test/fixtures/podcastFixtures";
import { createQueryWrapper } from "@/test/utils/testWrappers";
import { usePodcastList } from "../usePodcastList";

// Mock dependencies inline to ensure they work
vi.mock("@/infrastructure/repositories/ApiPodcastRepository", () => ({
  apiPodcastRepository: {
    getPodcasts: vi.fn(),
  },
}));

vi.mock("@/core/use-cases/filterPodcasts", () => ({
  filterPodcasts: vi.fn(),
}));

describe("usePodcastList", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const { filterPodcasts } = await import("@/core/use-cases/filterPodcasts");

    // Setup default filter behavior
    vi.mocked(filterPodcasts).mockImplementation((podcasts, searchTerm) =>
      podcasts.filter((p: Podcast) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  });

  it("should return initial state correctly", async () => {
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(mockPodcasts);

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.podcasts).toEqual([]);
    expect(result.current.podcastCount).toBe(0);
    expect(result.current.totalFilteredCount).toBe(0);
    expect(result.current.hasMore).toBe(false);
  });

  it("should load podcasts successfully", async () => {
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(mockPodcasts);

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toEqual(mockPodcasts);
    expect(result.current.podcastCount).toBe(3);
    expect(result.current.totalFilteredCount).toBe(3);
    expect(result.current.hasMore).toBe(false);
  });

  it("should handle search functionality", async () => {
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(mockPodcasts);

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm("tech");
    });

    expect(result.current.searchTerm).toBe("tech");
    expect(result.current.podcasts).toHaveLength(2);
    expect(result.current.podcasts.map((p) => p.name)).toEqual([
      "Tech Talk",
      "Tech News",
    ]);
    expect(result.current.totalFilteredCount).toBe(2);
  });

  it("should reset visible count when search changes", async () => {
    const largePodcastList = createLargePodcastList(50);
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(
      largePodcastList,
    );

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Load more podcasts
    act(() => {
      result.current.loadMore();
    });

    expect(result.current.podcastCount).toBe(35); // 20 initial + 15 increment

    // Change search term
    act(() => {
      result.current.setSearchTerm("1");
    });

    // Should reset to initial load count, but limited by filtered results
    expect(result.current.podcastCount).toBeLessThanOrEqual(20);
  });

  it("should handle load more functionality", async () => {
    const largePodcastList = createLargePodcastList(50);
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(
      largePodcastList,
    );

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toHaveLength(20); // INITIAL_LOAD
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.podcasts).toHaveLength(35); // 20 + 15 LOAD_INCREMENT
    expect(result.current.hasMore).toBe(true);

    // Load more until all are loaded
    act(() => {
      result.current.loadMore();
    });

    expect(result.current.podcasts).toHaveLength(50);
    expect(result.current.hasMore).toBe(false);
  });

  it("should not load more when hasMore is false", async () => {
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(mockPodcasts);

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
    const initialCount = result.current.podcastCount;

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.podcastCount).toBe(initialCount);
  });

  it("should handle empty search results", async () => {
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(mockPodcasts);

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm("nonexistent");
    });

    expect(result.current.podcasts).toHaveLength(0);
    expect(result.current.totalFilteredCount).toBe(0);
    expect(result.current.hasMore).toBe(false);
  });

  it("should handle API errors", async () => {
    const error = new Error("API Error");
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockRejectedValue(error);

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.podcasts).toEqual([]);
  });

  it("should handle whitespace-only search terms", async () => {
    const { apiPodcastRepository } = await import(
      "@/infrastructure/repositories/ApiPodcastRepository"
    );
    vi.mocked(apiPodcastRepository.getPodcasts).mockResolvedValue(mockPodcasts);

    const { result } = renderHook(() => usePodcastList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm("   ");
    });

    // Should show all podcasts when search term is only whitespace
    expect(result.current.podcasts).toEqual(mockPodcasts);
    expect(result.current.totalFilteredCount).toBe(3);
  });
});

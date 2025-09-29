import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPodcastDetail } from "@/test/fixtures/podcastFixtures";
import { createQueryWithUIWrapper } from "@/test/utils/testWrappers";
import { usePodcastDetail } from "../usePodcastDetail";

// Mock dependencies inline to ensure they work
vi.mock("@/infrastructure/query/podcastQueries", () => ({
  usePodcastDetail: vi.fn(),
}));

describe("usePodcastDetail", () => {
  const mockPodcastId = "test-podcast-id";

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get the mocked function
    const { usePodcastDetail: mockUsePodcastDetailQuery } = await import(
      "@/infrastructure/query/podcastQueries"
    );

    // Setup default implementation
    vi.mocked(mockUsePodcastDetailQuery).mockReturnValue({
      data: mockPodcastDetail,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof mockUsePodcastDetailQuery>);
  });

  it("should return query result and update UI loading state", async () => {
    const { result } = renderHook(() => usePodcastDetail(mockPodcastId), {
      wrapper: createQueryWithUIWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPodcastDetail);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  it("should handle loading state correctly", async () => {
    const { usePodcastDetail: mockUsePodcastDetailQuery } = await import(
      "@/infrastructure/query/podcastQueries"
    );
    vi.mocked(mockUsePodcastDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as ReturnType<typeof mockUsePodcastDetailQuery>);

    const { result } = renderHook(() => usePodcastDetail(mockPodcastId), {
      wrapper: createQueryWithUIWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should handle error state correctly", async () => {
    const mockError = new Error("Failed to fetch podcast");
    const { usePodcastDetail: mockUsePodcastDetailQuery } = await import(
      "@/infrastructure/query/podcastQueries"
    );
    vi.mocked(mockUsePodcastDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      isSuccess: false,
    } as ReturnType<typeof mockUsePodcastDetailQuery>);

    const { result } = renderHook(() => usePodcastDetail(mockPodcastId), {
      wrapper: createQueryWithUIWrapper(),
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
  });

  it("should pass the correct podcastId to the query", async () => {
    const { usePodcastDetail: mockUsePodcastDetailQuery } = await import(
      "@/infrastructure/query/podcastQueries"
    );

    renderHook(() => usePodcastDetail(mockPodcastId), {
      wrapper: createQueryWithUIWrapper(),
    });

    expect(vi.mocked(mockUsePodcastDetailQuery)).toHaveBeenCalledWith(
      mockPodcastId,
    );
  });

  it("should update loading state when query loading changes", async () => {
    const { usePodcastDetail: mockUsePodcastDetailQuery } = await import(
      "@/infrastructure/query/podcastQueries"
    );

    // First render with loading true
    vi.mocked(mockUsePodcastDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as ReturnType<typeof mockUsePodcastDetailQuery>);

    const { result, rerender } = renderHook(
      () => usePodcastDetail(mockPodcastId),
      {
        wrapper: createQueryWithUIWrapper(),
      },
    );

    expect(result.current.isLoading).toBe(true);

    // Update mock to loading false
    vi.mocked(mockUsePodcastDetailQuery).mockReturnValue({
      data: mockPodcastDetail,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof mockUsePodcastDetailQuery>);

    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockPodcastDetail);
    });
  });

  it("should work with different podcast IDs", async () => {
    const differentPodcastId = "different-podcast-id";
    const differentPodcastData = {
      ...mockPodcastDetail,
      id: differentPodcastId,
    };
    const { usePodcastDetail: mockUsePodcastDetailQuery } = await import(
      "@/infrastructure/query/podcastQueries"
    );

    vi.mocked(mockUsePodcastDetailQuery).mockReturnValue({
      data: differentPodcastData,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof mockUsePodcastDetailQuery>);

    const { result } = renderHook(() => usePodcastDetail(differentPodcastId), {
      wrapper: createQueryWithUIWrapper(),
    });

    expect(vi.mocked(mockUsePodcastDetailQuery)).toHaveBeenCalledWith(
      differentPodcastId,
    );
    expect(result.current.data).toEqual(differentPodcastData);
  });
});

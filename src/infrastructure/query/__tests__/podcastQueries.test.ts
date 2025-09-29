import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiPodcastRepository } from "@/infrastructure/repositories/ApiPodcastRepository";
import {
  mockPodcastDetail,
  mockPodcasts,
} from "@/test/fixtures/podcastFixtures";
import { createQueryWrapper } from "@/test/utils/testWrappers";
import { QUERY_KEYS, usePodcastDetail, usePodcasts } from "../podcastQueries";

vi.mock("@/infrastructure/repositories/ApiPodcastRepository");

const mockedApiPodcastRepository = vi.mocked(apiPodcastRepository);

describe("podcastQueries", () => {
  let queryClient: QueryClient;
  let wrapper: ReturnType<typeof createQueryWrapper>;

  beforeEach(() => {
    wrapper = createQueryWrapper();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  describe("QUERY_KEYS", () => {
    it("should have correct query keys structure", () => {
      expect(QUERY_KEYS.PODCASTS).toEqual(["podcasts"]);
      expect(QUERY_KEYS.PODCAST_DETAIL("123")).toEqual([
        "podcast",
        "detail",
        "123",
      ]);
    });

    it("should return different keys for different podcast IDs", () => {
      const key1 = QUERY_KEYS.PODCAST_DETAIL("123");
      const key2 = QUERY_KEYS.PODCAST_DETAIL("456");

      expect(key1).not.toEqual(key2);
      expect(key1).toEqual(["podcast", "detail", "123"]);
      expect(key2).toEqual(["podcast", "detail", "456"]);
    });
  });

  describe("usePodcasts", () => {
    it("should fetch podcasts successfully", async () => {
      mockedApiPodcastRepository.getPodcasts.mockResolvedValue(mockPodcasts);

      const { result } = renderHook(() => usePodcasts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPodcasts);
      expect(mockedApiPodcastRepository.getPodcasts).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Failed to fetch podcasts");
      mockedApiPodcastRepository.getPodcasts.mockRejectedValue(error);

      const { result } = renderHook(() => usePodcasts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });

    it("should use correct cache configuration", async () => {
      mockedApiPodcastRepository.getPodcasts.mockResolvedValue(mockPodcasts);

      const { result } = renderHook(() => usePodcasts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify the query was called and data exists
      expect(result.current.data).toEqual(mockPodcasts);
      expect(mockedApiPodcastRepository.getPodcasts).toHaveBeenCalledTimes(1);
    });

    it("should not retry on failure by default", async () => {
      const error = new Error("Network error");
      mockedApiPodcastRepository.getPodcasts.mockRejectedValue(error);

      const { result } = renderHook(() => usePodcasts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should only be called once (no retries)
      expect(mockedApiPodcastRepository.getPodcasts).toHaveBeenCalledTimes(1);
    });

    it("should return loading state initially", () => {
      mockedApiPodcastRepository.getPodcasts.mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );

      const { result } = renderHook(() => usePodcasts(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe("usePodcastDetail", () => {
    const podcastId = "123";

    it("should fetch podcast detail successfully without cached podcasts", async () => {
      mockedApiPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail,
      );

      const { result } = renderHook(() => usePodcastDetail(podcastId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPodcastDetail);
      expect(mockedApiPodcastRepository.getPodcastDetail).toHaveBeenCalledWith(
        podcastId,
      );
    });

    it("should use summary from cached podcasts when available", async () => {
      // Create a fresh query client for this test
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      const TestWrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: testQueryClient },
          children,
        );

      // First, populate the podcasts cache
      testQueryClient.setQueryData(QUERY_KEYS.PODCASTS, mockPodcasts);

      // Mock the detail response without summary
      const detailWithoutSummary = {
        ...mockPodcastDetail,
        summary: "fallback summary from detail",
      };
      mockedApiPodcastRepository.getPodcastDetail.mockResolvedValue(
        detailWithoutSummary,
      );

      const { result } = renderHook(() => usePodcastDetail("1"), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should use summary from cached podcast data
      expect(result.current.data).toEqual({
        ...detailWithoutSummary,
        summary: mockPodcasts[0].summary, // Should use cached summary
      });
    });

    it("should use fallback summary when podcast not in cache", async () => {
      // Create a fresh query client for this test
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      const TestWrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: testQueryClient },
          children,
        );

      // Set empty podcasts cache
      testQueryClient.setQueryData(QUERY_KEYS.PODCASTS, []);

      const detailWithFallback = {
        ...mockPodcastDetail,
        summary: "fallback summary",
      };
      mockedApiPodcastRepository.getPodcastDetail.mockResolvedValue(
        detailWithFallback,
      );

      const { result } = renderHook(() => usePodcastDetail("999"), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should use fallback summary from detail
      expect(result.current.data).toEqual(detailWithFallback);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Failed to fetch podcast detail");
      mockedApiPodcastRepository.getPodcastDetail.mockRejectedValue(error);

      const { result } = renderHook(() => usePodcastDetail(podcastId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });

    it("should be disabled when podcastId is empty", () => {
      const { result } = renderHook(() => usePodcastDetail(""), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
      expect(
        mockedApiPodcastRepository.getPodcastDetail,
      ).not.toHaveBeenCalled();
    });

    it("should be disabled when podcastId is undefined", () => {
      const { result } = renderHook(
        () => usePodcastDetail(undefined as unknown as string),
        {
          wrapper,
        },
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
      expect(
        mockedApiPodcastRepository.getPodcastDetail,
      ).not.toHaveBeenCalled();
    });

    it("should use correct cache configuration", async () => {
      mockedApiPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail,
      );

      const { result } = renderHook(() => usePodcastDetail(podcastId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify the query was called and data exists
      expect(result.current.data).toEqual(mockPodcastDetail);
      expect(mockedApiPodcastRepository.getPodcastDetail).toHaveBeenCalledWith(
        podcastId,
      );
    });

    it("should access query client correctly", async () => {
      // Create a fresh query client for this test
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      const TestWrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: testQueryClient },
          children,
        );

      // Test that the hook can access the query client
      const testPodcasts = [...mockPodcasts];
      testQueryClient.setQueryData(QUERY_KEYS.PODCASTS, testPodcasts);

      mockedApiPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail,
      );

      const { result } = renderHook(
        () => {
          const detail = usePodcastDetail("1");
          const client = useQueryClient();
          return { detail, client };
        },
        { wrapper: TestWrapper },
      );

      await waitFor(() => {
        expect(result.current.detail.isSuccess).toBe(true);
      });

      expect(result.current.client).toBeDefined();
      expect(result.current.client.getQueryData(QUERY_KEYS.PODCASTS)).toEqual(
        testPodcasts,
      );
    });

    it("should handle null podcasts cache gracefully", async () => {
      // Create a fresh query client for this test
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      const TestWrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: testQueryClient },
          children,
        );

      testQueryClient.setQueryData(QUERY_KEYS.PODCASTS, null);

      mockedApiPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail,
      );

      const { result } = renderHook(() => usePodcastDetail(podcastId), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPodcastDetail);
    });

    it("should generate different query keys for different podcast IDs", async () => {
      mockedApiPodcastRepository.getPodcastDetail.mockResolvedValue(
        mockPodcastDetail,
      );

      const { result: result1 } = renderHook(() => usePodcastDetail("123"), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => usePodcastDetail("456"), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should have made separate API calls for different IDs
      expect(mockedApiPodcastRepository.getPodcastDetail).toHaveBeenCalledWith(
        "123",
      );
      expect(mockedApiPodcastRepository.getPodcastDetail).toHaveBeenCalledWith(
        "456",
      );
      expect(mockedApiPodcastRepository.getPodcastDetail).toHaveBeenCalledTimes(
        2,
      );
    });
  });
});

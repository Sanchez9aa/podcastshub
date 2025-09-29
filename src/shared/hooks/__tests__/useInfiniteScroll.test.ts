import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultInfiniteScrollOptions } from "@/test/fixtures/hookFixtures";
import { useInfiniteScroll } from "../useInfiniteScroll";

// Setup IntersectionObserver mock
Object.defineProperty(globalThis, "IntersectionObserver", {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
  writable: true,
});

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return sentinelRef with initial null value", () => {
    const { result } = renderHook(() =>
      useInfiniteScroll(defaultInfiniteScrollOptions),
    );

    expect(result.current.sentinelRef).toBeDefined();
    expect(result.current.sentinelRef.current).toBeNull();
  });

  it("should accept all required options", () => {
    const options = {
      hasMore: false,
      isLoading: true,
      onLoadMore: vi.fn(),
      threshold: 100,
    };

    const { result } = renderHook(() => useInfiniteScroll(options));

    expect(result.current.sentinelRef).toBeDefined();
  });

  it("should handle options changes without errors", () => {
    const { result, rerender } = renderHook(
      (props) => useInfiniteScroll(props),
      {
        initialProps: defaultInfiniteScrollOptions,
      },
    );

    expect(result.current.sentinelRef).toBeDefined();

    // Change props
    rerender({
      ...defaultInfiniteScrollOptions,
      hasMore: false,
    });

    expect(result.current.sentinelRef).toBeDefined();
  });

  it("should handle isLoading state changes", () => {
    const { result, rerender } = renderHook(
      (props) => useInfiniteScroll(props),
      {
        initialProps: {
          ...defaultInfiniteScrollOptions,
          isLoading: false,
        },
      },
    );

    expect(result.current.sentinelRef).toBeDefined();

    rerender({
      ...defaultInfiniteScrollOptions,
      isLoading: true,
    });

    expect(result.current.sentinelRef).toBeDefined();
  });

  it("should handle hasMore state changes", () => {
    const { result, rerender } = renderHook(
      (props) => useInfiniteScroll(props),
      {
        initialProps: {
          ...defaultInfiniteScrollOptions,
          hasMore: true,
        },
      },
    );

    expect(result.current.sentinelRef).toBeDefined();

    rerender({
      ...defaultInfiniteScrollOptions,
      hasMore: false,
    });

    expect(result.current.sentinelRef).toBeDefined();
  });

  it("should handle onLoadMore function changes", () => {
    const onLoadMore1 = vi.fn();
    const onLoadMore2 = vi.fn();

    const { result, rerender } = renderHook(
      (props) => useInfiniteScroll(props),
      {
        initialProps: {
          ...defaultInfiniteScrollOptions,
          onLoadMore: onLoadMore1,
        },
      },
    );

    expect(result.current.sentinelRef).toBeDefined();

    rerender({
      ...defaultInfiniteScrollOptions,
      onLoadMore: onLoadMore2,
    });

    expect(result.current.sentinelRef).toBeDefined();
  });

  it("should handle custom threshold", () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        ...defaultInfiniteScrollOptions,
        threshold: 500,
      }),
    );

    expect(result.current.sentinelRef).toBeDefined();
  });

  it("should handle component unmount without errors", () => {
    const { result, unmount } = renderHook(() =>
      useInfiniteScroll(defaultInfiniteScrollOptions),
    );

    expect(result.current.sentinelRef).toBeDefined();

    expect(() => unmount()).not.toThrow();
  });

  it("should return consistent ref object", () => {
    const { result, rerender } = renderHook(() =>
      useInfiniteScroll(defaultInfiniteScrollOptions),
    );

    const firstRef = result.current.sentinelRef;

    rerender();

    const secondRef = result.current.sentinelRef;

    // The ref object should be the same across renders
    expect(firstRef).toBe(secondRef);
  });

  it("should work with minimal options", () => {
    const minimalOptions = {
      hasMore: true,
      isLoading: false,
      onLoadMore: vi.fn(),
    };

    const { result } = renderHook(() => useInfiniteScroll(minimalOptions));

    expect(result.current.sentinelRef).toBeDefined();
    expect(result.current.sentinelRef.current).toBeNull();
  });

  it("should handle edge case with hasMore false and isLoading true", () => {
    const edgeCaseOptions = {
      hasMore: false,
      isLoading: true,
      onLoadMore: vi.fn(),
    };

    const { result } = renderHook(() => useInfiniteScroll(edgeCaseOptions));

    expect(result.current.sentinelRef).toBeDefined();
  });
});

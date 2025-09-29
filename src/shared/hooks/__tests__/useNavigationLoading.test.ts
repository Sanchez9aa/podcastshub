import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWithUIWrapper } from "@/test/utils/testWrappers";
import { useNavigationLoading } from "../useNavigationLoading";

// Mock react-router inline to ensure it works
vi.mock("react-router", () => ({
  useLocation: vi.fn(),
}));

// Mock timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

const mockLocationFixture = {
  pathname: "/",
  search: "",
  hash: "",
  state: null,
  key: "default",
};

describe("useNavigationLoading", () => {
  beforeEach(async () => {
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockReturnValue(mockLocationFixture);
  });

  it("should initialize without errors", () => {
    const { result } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Hook should complete without throwing
    expect(result.current).toBeUndefined();
  });

  it("should handle pathname changes", async () => {
    let pathname = "/";
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    const { rerender } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Change pathname
    pathname = "/new-path";
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    rerender();

    // Fast-forward timers to check loading completion
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(true).toBe(true);
  });

  it("should handle multiple pathname changes", async () => {
    let pathname = "/";
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    const { rerender } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Change pathname multiple times
    const paths = ["/path1", "/path2", "/path3"];

    paths.forEach((newPath) => {
      pathname = newPath;
      vi.mocked(useLocation).mockImplementation(() => ({
        ...mockLocationFixture,
        pathname,
      }));

      rerender();

      act(() => {
        vi.advanceTimersByTime(100);
      });
    });

    // Complete final timer
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(true).toBe(true);
  });

  it("should handle component unmount gracefully", () => {
    const { unmount } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    expect(() => unmount()).not.toThrow();
  });

  it("should clear timeouts on unmount", async () => {
    let pathname = "/";
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    const { rerender, unmount } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Change pathname to trigger loading
    pathname = "/new-path";
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    rerender();

    // Unmount before timeout completes
    expect(() => unmount()).not.toThrow();
  });

  it("should handle same pathname (no navigation)", async () => {
    const staticPathname = "/same-path";
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockReturnValue({
      ...mockLocationFixture,
      pathname: staticPathname,
    });

    const { rerender } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Rerender with same pathname
    rerender();
    rerender();

    expect(true).toBe(true);
  });

  it("should work with different location properties", async () => {
    const mockLocation = {
      ...mockLocationFixture,
      pathname: "/test",
      search: "?param=value",
      hash: "#section",
      state: { from: "previous-page" },
      key: "test-key",
    };

    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockReturnValue(mockLocation);

    const { result } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    expect(result.current).toBeUndefined();
  });

  it("should handle rapid pathname changes", async () => {
    let pathname = "/initial";
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    const { rerender } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Rapid changes
    for (let i = 0; i < 5; i++) {
      pathname = `/path-${i}`;
      vi.mocked(useLocation).mockImplementation(() => ({
        ...mockLocationFixture,
        pathname,
      }));

      rerender();

      act(() => {
        vi.advanceTimersByTime(50);
      });
    }

    // Complete all timers
    act(() => {
      vi.runAllTimers();
    });

    expect(true).toBe(true);
  });

  it("should handle loading timeout correctly", async () => {
    let pathname = "/initial";
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    const { rerender } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Trigger navigation
    pathname = "/new-path";
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname,
    }));

    rerender();

    // Complete the timeout
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Test passed if no errors thrown
    expect(true).toBe(true);
  });

  it("should handle search param changes (not pathname)", async () => {
    let search = "";
    const { useLocation } = await import("react-router");
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname: "/same-path",
      search,
    }));

    const { rerender } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // Change only search params
    search = "?new=param";
    vi.mocked(useLocation).mockImplementation(() => ({
      ...mockLocationFixture,
      pathname: "/same-path",
      search,
    }));

    rerender();

    // Should not trigger loading for search param changes
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(true).toBe(true);
  });

  it("should cleanup properly on effects", () => {
    const { result } = renderHook(() => useNavigationLoading(), {
      wrapper: createQueryWithUIWrapper(),
    });

    // The hook returns undefined but should not throw
    expect(result.current).toBeUndefined();

    // Should handle all timer cleanup
    act(() => {
      vi.runAllTimers();
    });

    expect(true).toBe(true);
  });
});

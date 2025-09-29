import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAudioMetadata } from "../useAudioMetadata";

describe("useAudioMetadata", () => {
  it("should return initial state correctly", () => {
    const { result } = renderHook(() => useAudioMetadata());

    expect(result.current.hasError).toBe(false);
    expect(typeof result.current.onError).toBe("function");
  });

  it("should set hasError to true when onError is called", () => {
    const { result } = renderHook(() => useAudioMetadata());

    expect(result.current.hasError).toBe(false);

    act(() => {
      result.current.onError();
    });

    expect(result.current.hasError).toBe(true);
  });

  it("should maintain hasError state after multiple calls", () => {
    const { result } = renderHook(() => useAudioMetadata());

    act(() => {
      result.current.onError();
    });

    expect(result.current.hasError).toBe(true);

    // Call onError again
    act(() => {
      result.current.onError();
    });

    expect(result.current.hasError).toBe(true);
  });

  it("should provide stable onError function reference", () => {
    const { result, rerender } = renderHook(() => useAudioMetadata());

    const firstOnError = result.current.onError;

    rerender();

    const secondOnError = result.current.onError;

    expect(firstOnError).toBe(secondOnError);
  });

  it("should not reset hasError state on rerender", () => {
    const { result, rerender } = renderHook(() => useAudioMetadata());

    act(() => {
      result.current.onError();
    });

    expect(result.current.hasError).toBe(true);

    rerender();

    expect(result.current.hasError).toBe(true);
  });

  it("should work with multiple hook instances independently", () => {
    const { result: result1 } = renderHook(() => useAudioMetadata());
    const { result: result2 } = renderHook(() => useAudioMetadata());

    expect(result1.current.hasError).toBe(false);
    expect(result2.current.hasError).toBe(false);

    act(() => {
      result1.current.onError();
    });

    expect(result1.current.hasError).toBe(true);
    expect(result2.current.hasError).toBe(false);

    act(() => {
      result2.current.onError();
    });

    expect(result1.current.hasError).toBe(true);
    expect(result2.current.hasError).toBe(true);
  });

  it("should match the expected return type interface", () => {
    const { result } = renderHook(() => useAudioMetadata());

    // Check that the return value matches UseAudioMetadataReturn interface
    expect(result.current).toHaveProperty("hasError");
    expect(result.current).toHaveProperty("onError");
    expect(typeof result.current.hasError).toBe("boolean");
    expect(typeof result.current.onError).toBe("function");
  });
});

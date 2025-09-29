import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UIProvider, useUI } from "./UIContext";

// Test wrapper component to use the hook
const TestComponent = () => {
  const { isLoading, setLoading, startLoading, stopLoading } = useUI();

  return (
    <div>
      <div data-testid="loading-state">
        {isLoading ? "Loading" : "Not Loading"}
      </div>
      <button
        type="button"
        data-testid="set-loading-true"
        onClick={() => setLoading(true)}
      >
        Set Loading True
      </button>
      <button
        type="button"
        data-testid="set-loading-false"
        onClick={() => setLoading(false)}
      >
        Set Loading False
      </button>
      <button type="button" data-testid="start-loading" onClick={startLoading}>
        Start Loading
      </button>
      <button type="button" data-testid="stop-loading" onClick={stopLoading}>
        Stop Loading
      </button>
    </div>
  );
};

describe("UIContext", () => {
  describe("UIProvider", () => {
    it("provides initial loading state as false", () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>,
      );

      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "Not Loading",
      );
    });

    it("renders children correctly", () => {
      render(
        <UIProvider>
          <div data-testid="child">Child Component</div>
        </UIProvider>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("allows setting loading state via setLoading", () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>,
      );

      const setTrueButton = screen.getByTestId("set-loading-true");
      const setFalseButton = screen.getByTestId("set-loading-false");
      const loadingState = screen.getByTestId("loading-state");

      // Initial state
      expect(loadingState).toHaveTextContent("Not Loading");

      // Set to true
      act(() => {
        setTrueButton.click();
      });
      expect(loadingState).toHaveTextContent("Loading");

      // Set to false
      act(() => {
        setFalseButton.click();
      });
      expect(loadingState).toHaveTextContent("Not Loading");
    });

    it("allows starting loading via startLoading", () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>,
      );

      const startButton = screen.getByTestId("start-loading");
      const loadingState = screen.getByTestId("loading-state");

      expect(loadingState).toHaveTextContent("Not Loading");

      act(() => {
        startButton.click();
      });

      expect(loadingState).toHaveTextContent("Loading");
    });

    it("allows stopping loading via stopLoading", () => {
      render(
        <UIProvider>
          <TestComponent />
        </UIProvider>,
      );

      const startButton = screen.getByTestId("start-loading");
      const stopButton = screen.getByTestId("stop-loading");
      const loadingState = screen.getByTestId("loading-state");

      // Start loading first
      act(() => {
        startButton.click();
      });
      expect(loadingState).toHaveTextContent("Loading");

      // Stop loading
      act(() => {
        stopButton.click();
      });
      expect(loadingState).toHaveTextContent("Not Loading");
    });

    it("provides all context methods and state", () => {
      const { result } = renderHook(() => useUI(), {
        wrapper: UIProvider,
      });

      expect(result.current).toHaveProperty("isLoading", false);
      expect(result.current).toHaveProperty("setLoading");
      expect(result.current).toHaveProperty("startLoading");
      expect(result.current).toHaveProperty("stopLoading");
      expect(typeof result.current.setLoading).toBe("function");
      expect(typeof result.current.startLoading).toBe("function");
      expect(typeof result.current.stopLoading).toBe("function");
    });

    it("updates isLoading state correctly via hook", () => {
      const { result } = renderHook(() => useUI(), {
        wrapper: UIProvider,
      });

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.startLoading();
      });
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.stopLoading();
      });
      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("useUI hook", () => {
    it("throws error when used outside UIProvider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useUI());
      }).toThrow("useUI must be used within a UIProvider");

      console.error = originalError;
    });

    it("returns context value when used within UIProvider", () => {
      const { result } = renderHook(() => useUI(), {
        wrapper: UIProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("State consistency", () => {
    it("maintains state consistency across multiple consumers", () => {
      const Consumer1 = () => {
        const { isLoading } = useUI();
        return (
          <div data-testid="consumer1">
            {isLoading ? "Loading" : "Not Loading"}
          </div>
        );
      };

      const Consumer2 = () => {
        const { isLoading, startLoading } = useUI();
        return (
          <div>
            <div data-testid="consumer2">
              {isLoading ? "Loading" : "Not Loading"}
            </div>
            <button
              type="button"
              data-testid="consumer2-start"
              onClick={startLoading}
            >
              Start
            </button>
          </div>
        );
      };

      render(
        <UIProvider>
          <Consumer1 />
          <Consumer2 />
        </UIProvider>,
      );

      const consumer1 = screen.getByTestId("consumer1");
      const consumer2 = screen.getByTestId("consumer2");
      const startButton = screen.getByTestId("consumer2-start");

      // Both should show same initial state
      expect(consumer1).toHaveTextContent("Not Loading");
      expect(consumer2).toHaveTextContent("Not Loading");

      // Update from one consumer should affect both
      act(() => {
        startButton.click();
      });

      expect(consumer1).toHaveTextContent("Loading");
      expect(consumer2).toHaveTextContent("Loading");
    });
  });
});

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";
import {
  AuthenticationError,
  NetworkError,
  TimeoutError,
} from "@/shared/errors/types/api-errors";

// Component that throws errors for testing
function ThrowError({ error }: { error?: Error }) {
  if (error) {
    throw error;
  }
  return <div>No error</div>;
}

describe("ErrorBoundary", () => {
  // Suppress console.error for cleaner test output
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when no error occurs", () => {
    it("should render children normally", () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child component</div>
        </ErrorBoundary>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Child component")).toBeInTheDocument();
    });
  });

  describe("when API authentication error occurs", () => {
    it("should render authentication error UI", () => {
      const authError = new AuthenticationError("TMDB", "Invalid API key");

      render(
        <ErrorBoundary>
          <ThrowError error={authError} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Authentication Error")).toBeInTheDocument();
      expect(screen.getByText(/API key issue/i)).toBeInTheDocument();
      expect(screen.getByText(/TMDB.*Invalid API key/i)).toBeInTheDocument();
    });

    it("should show retry button for authentication errors", () => {
      const authError = new AuthenticationError("TMDB", "Invalid API key");

      render(
        <ErrorBoundary>
          <ThrowError error={authError} />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });
  });

  describe("when network error occurs", () => {
    it("should render network error UI", () => {
      const networkError = new NetworkError(
        "TMDB",
        new Error("Connection failed"),
      );

      render(
        <ErrorBoundary>
          <ThrowError error={networkError} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Connection Error")).toBeInTheDocument();
      expect(screen.getByText(/network issue/i)).toBeInTheDocument();
      expect(
        screen.getByText(/check your internet connection/i),
      ).toBeInTheDocument();
    });

    it("should show retry button for network errors", () => {
      const networkError = new NetworkError(
        "TMDB",
        new Error("Connection failed"),
      );

      render(
        <ErrorBoundary>
          <ThrowError error={networkError} />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });
  });

  describe("when timeout error occurs", () => {
    it("should render timeout error UI", () => {
      const timeoutError = new TimeoutError("TMDB", 5000);

      render(
        <ErrorBoundary>
          <ThrowError error={timeoutError} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Request Timeout")).toBeInTheDocument();
      expect(screen.getByText(/request took too long/i)).toBeInTheDocument();
      expect(screen.getByText(/try again in a moment/i)).toBeInTheDocument();
    });
  });

  describe("when generic error occurs", () => {
    it("should render generic error UI", () => {
      const genericError = new Error("Something went wrong");

      render(
        <ErrorBoundary>
          <ThrowError error={genericError} />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole("heading", { name: "Something went wrong" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/unexpected error occurred/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });
  });

  describe("retry functionality", () => {
    it("should reset error state when retry button is clicked", () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError error={new Error("Test error")} />
        </ErrorBoundary>,
      );

      // Error should be displayed
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Click retry button
      const retryButton = screen.getByRole("button", { name: /try again/i });
      retryButton.click();

      // Rerender with no error
      rerender(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should show normal content
      expect(screen.getByText("No error")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });
  });

  describe("error reporting", () => {
    it("should log errors to console in development", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const testError = new Error("Test error");

      render(
        <ErrorBoundary>
          <ThrowError error={testError} />
        </ErrorBoundary>,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "ErrorBoundary caught an error:",
        expect.objectContaining({
          error: testError.message,
          stack: testError.stack,
          componentStack: expect.any(String),
          errorBoundary: "Page",
        }),
      );
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <ErrorBoundary>
          <ThrowError error={new Error("Test error")} />
        </ErrorBoundary>,
      );

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveAttribute("aria-live", "assertive");
    });

    it("should focus on error message for screen readers", () => {
      render(
        <ErrorBoundary>
          <ThrowError error={new Error("Test error")} />
        </ErrorBoundary>,
      );

      const errorHeading = screen.getByRole("heading", { level: 2 });
      expect(errorHeading).toHaveAttribute("tabIndex", "-1");
    });
  });
});

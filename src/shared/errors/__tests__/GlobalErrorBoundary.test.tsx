import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlobalErrorBoundary } from "@/shared/errors/GlobalErrorBoundary";

// Component that throws errors for testing
function ThrowError({ error }: { error?: Error }) {
  if (error) {
    throw error;
  }
  return <div>No error</div>;
}

// Mock window methods
const mockReload = vi.fn();
const mockHistoryBack = vi.fn();

// Mock window.location.reload and window.history.back
Object.defineProperty(window, "location", {
  value: {
    reload: mockReload,
  },
  writable: true,
});

Object.defineProperty(window, "history", {
  value: {
    back: mockHistoryBack,
  },
  writable: true,
});

describe("GlobalErrorBoundary", () => {
  // Suppress console.error for cleaner test output
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockReload.mockClear();
    mockHistoryBack.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when no error occurs", () => {
    it("should render children normally", () => {
      render(
        <GlobalErrorBoundary>
          <div data-testid="child">Child component</div>
        </GlobalErrorBoundary>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Child component")).toBeInTheDocument();
    });
  });

  describe("when any error occurs", () => {
    it("should render global error UI", () => {
      const genericError = new Error("Something broke");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={genericError} />
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText(/We're sorry, but something unexpected happened/),
      ).toBeInTheDocument();
    });

    it("should show reload and go back buttons", () => {
      const genericError = new Error("Something broke");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={genericError} />
        </GlobalErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /reload page/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /go back/i }),
      ).toBeInTheDocument();
    });
  });

  describe("error interaction", () => {
    it("should reload page when reload button is clicked", () => {
      const genericError = new Error("Something broke");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={genericError} />
        </GlobalErrorBoundary>,
      );

      const reloadButton = screen.getByRole("button", { name: /reload page/i });
      fireEvent.click(reloadButton);

      expect(mockReload).toHaveBeenCalledOnce();
    });

    it("should go back when go back button is clicked", () => {
      const genericError = new Error("Something broke");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={genericError} />
        </GlobalErrorBoundary>,
      );

      const goBackButton = screen.getByRole("button", { name: /go back/i });
      fireEvent.click(goBackButton);

      expect(mockHistoryBack).toHaveBeenCalledOnce();
    });
  });

  describe("error logging", () => {
    it("should log errors to console with global context", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const testError = new Error("Test error");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={testError} />
        </GlobalErrorBoundary>,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "🚨 Global Error Caught:",
        expect.objectContaining({
          error: "Test error",
          errorBoundary: "Global",
        }),
      );
    });
  });

  describe("accessibility", () => {
    it("should have proper heading structure", () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError error={new Error("Test error")} />
        </GlobalErrorBoundary>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Something went wrong");
    });

    it("should have accessible button labels", () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError error={new Error("Test error")} />
        </GlobalErrorBoundary>,
      );

      const reloadButton = screen.getByRole("button", { name: /reload page/i });
      const backButton = screen.getByRole("button", { name: /go back/i });

      expect(reloadButton).toBeInTheDocument();
      expect(backButton).toBeInTheDocument();
    });
  });

  describe("development mode", () => {
    let originalEnv: ImportMetaEnv;

    beforeEach(() => {
      originalEnv = import.meta.env;
    });

    afterEach(() => {
      // Restore original env
      Object.defineProperty(import.meta, "env", {
        value: originalEnv,
        writable: true,
        configurable: true,
      });
    });

    it("should show error details in development mode", () => {
      // Mock DEV as true
      Object.defineProperty(import.meta, "env", {
        value: { ...originalEnv, DEV: true },
        writable: true,
        configurable: true,
      });

      const testError = new Error("Test error with stack");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={testError} />
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText("Error Details (Dev Mode)")).toBeInTheDocument();
    });
  });

  describe("different error types", () => {
    it("should handle JavaScript runtime errors", () => {
      const runtimeError = new ReferenceError(
        "Cannot read property of undefined",
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={runtimeError} />
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should handle syntax errors", () => {
      const syntaxError = new SyntaxError("Unexpected token");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={syntaxError} />
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should handle custom errors", () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = "CustomError";
        }
      }

      const customError = new CustomError("Custom error message");

      render(
        <GlobalErrorBoundary>
          <ThrowError error={customError} />
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});

import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/shared/components/layout/Header/Header";
import { UIProvider, useUI } from "@/shared/context/UIContext";

// Mock useNavigationLoading hook
vi.mock("@/shared/hooks/useNavigationLoading", () => ({
  useNavigationLoading: vi.fn(),
}));

const TestWrapper = ({
  isLoading = false,
  children,
}: {
  isLoading?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <BrowserRouter>
      <UIProvider>
        <TestComponent isLoading={isLoading}>{children}</TestComponent>
      </UIProvider>
    </BrowserRouter>
  );
};

// Helper component to set loading state
const TestComponent = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) => {
  const { setLoading } = useUI();

  // Set loading state immediately when component mounts
  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return <>{children}</>;
};

describe("Header", () => {
  it("renders logo and title", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const title = screen.getByText("Podcaster");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H1");

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("does not show spinner when not loading", () => {
    render(
      <TestWrapper isLoading={false}>
        <Header />
      </TestWrapper>,
    );

    expect(screen.queryByLabelText("Loading...")).not.toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    const { container } = render(
      <TestWrapper isLoading={true}>
        <Header />
      </TestWrapper>,
    );

    // Check that a spinner element exists in the component
    const spinnerElement = container.querySelector('[aria-label="Loading..."]');
    expect(spinnerElement).toBeInTheDocument();
  });

  it("renders as header element", () => {
    const { container } = render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    expect(container.querySelector("header")).toBeInTheDocument();
  });

  it("logo link has correct styling classes", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const link = screen.getByRole("link");
    expect(link.className).toContain("logo");
  });

  it("has proper accessibility attributes", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    // Check header semantic
    const header = screen.getByRole("banner");
    expect(header.tagName).toBe("HEADER");

    // Check logo link accessibility
    const logoLink = screen.getByRole("link");
    expect(logoLink).toHaveAttribute(
      "aria-label",
      "Podcaster - Go to home page",
    );
  });

  it("spinner has correct aria-live announcement", () => {
    const { container } = render(
      <TestWrapper isLoading={true}>
        <Header />
      </TestWrapper>,
    );

    const spinnerContainer = container.querySelector('[aria-live="polite"]');
    expect(spinnerContainer).toBeInTheDocument();

    // Check for hidden loading text
    const hiddenText = screen.getByText("Loading content...");
    expect(hiddenText).toBeInTheDocument();
    expect(hiddenText.className).toContain("visuallyHidden");
  });
});

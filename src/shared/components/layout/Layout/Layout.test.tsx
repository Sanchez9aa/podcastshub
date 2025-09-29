import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { Layout } from "./Layout";

// Mock the Header component
vi.mock("@/shared/components/layout/Header/Header", () => ({
  Header: () => <header data-testid="mock-header">Header</header>,
}));

// Create a test wrapper with router
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe("Layout", () => {
  it("renders the layout structure correctly", () => {
    const { container } = render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    // Check main layout container
    const layoutDiv = container.querySelector('[class*="layout"]');
    expect(layoutDiv).toBeInTheDocument();
  });

  it("renders Header component", () => {
    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    const header = screen.getByTestId("mock-header");
    expect(header).toBeInTheDocument();
  });

  it("renders main content area with correct id and role", () => {
    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("main element has correct CSS class", () => {
    const { container } = render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    const main = container.querySelector("main");
    expect(main?.className).toContain("main");
  });

  it("has proper semantic structure", () => {
    const { container } = render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    // Check that header comes before main
    const header = container.querySelector("header");
    const main = container.querySelector("main");

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();

    // Verify header comes before main in DOM order
    const headerIndex = Array.from(container.querySelectorAll("*")).indexOf(
      header as Element,
    );
    const mainIndex = Array.from(container.querySelectorAll("*")).indexOf(
      main as Element,
    );
    expect(headerIndex).toBeLessThan(mainIndex);
  });

  it("provides outlet for nested routes", () => {
    // Since Outlet doesn't render anything by itself when no routes match,
    // we test that the main content container is present and ready for content
    const { container } = render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    // The main element exists and will contain outlet content when routes match
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("applies CSS module classes correctly", () => {
    const { container } = render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    const layoutDiv = container.querySelector("div");
    const main = container.querySelector("main");

    // Check that CSS module classes are applied
    expect(layoutDiv?.className).toBeTruthy();
    expect(main?.className).toBeTruthy();
  });

  it("has accessible main landmark", () => {
    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    // Main should be accessible as landmark
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
  });
});

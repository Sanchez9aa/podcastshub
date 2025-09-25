import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("should render without crashing", () => {
    render(<App />);
    expect(screen.getByText("Podcaster")).toBeInTheDocument();
  });

  it("should show loading skeleton", () => {
    render(<App />);
    // PageSkeleton shows skeleton cards instead of spinner
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(12);
  });
});

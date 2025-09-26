import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "@/shared/components/ui/Spinner/Spinner";

describe("Spinner", () => {
  it("renders with default medium size", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText("Loading...");
    expect(spinner).toBeInTheDocument();
    expect(spinner.className).toContain("spinner");
    expect(spinner.className).toContain("medium");
  });

  it("renders with small size", () => {
    render(<Spinner size="small" />);
    const spinner = screen.getByLabelText("Loading...");
    expect(spinner.className).toContain("spinner");
    expect(spinner.className).toContain("small");
  });

  it("renders with large size", () => {
    render(<Spinner size="large" />);
    const spinner = screen.getByLabelText("Loading...");
    expect(spinner.className).toContain("spinner");
    expect(spinner.className).toContain("large");
  });

  it("applies custom className", () => {
    render(<Spinner className="custom-class" />);
    const spinner = screen.getByLabelText("Loading...");
    expect(spinner.className).toContain("custom-class");
  });

  it("has correct accessibility attributes", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText("Loading...");
    expect(spinner).toHaveAttribute("aria-label", "Loading...");
    expect(spinner).toHaveAttribute("role", "status");
    expect(spinner).toHaveAttribute("aria-live", "polite");

    // Check that circle is hidden from screen readers
    const circle = spinner.querySelector('[aria-hidden="true"]');
    expect(circle).toBeInTheDocument();
  });
});

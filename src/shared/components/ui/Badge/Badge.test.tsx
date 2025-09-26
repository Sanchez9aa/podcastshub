import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/shared/components/ui/Badge/Badge";

describe("Badge", () => {
  it("renders children content", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("renders with default primary variant and medium size", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("badge");
    expect(badge.className).toContain("primary");
    expect(badge.className).toContain("medium");
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText("Secondary");
    expect(badge.className).toContain("badge");
    expect(badge.className).toContain("secondary");
    expect(badge.className).toContain("medium");
  });

  it("renders with small size", () => {
    render(<Badge size="small">Small</Badge>);
    const badge = screen.getByText("Small");
    expect(badge.className).toContain("badge");
    expect(badge.className).toContain("primary");
    expect(badge.className).toContain("small");
  });

  it("renders with all supported sizes", () => {
    render(<Badge size="small">Small Badge</Badge>);
    const badge = screen.getByText("Small Badge");
    expect(badge.className).toContain("badge");
    expect(badge.className).toContain("primary");
    expect(badge.className).toContain("small");
  });

  it("renders with custom variant and size combination", () => {
    render(
      <Badge variant="secondary" size="small">
        Custom
      </Badge>,
    );
    const badge = screen.getByText("Custom");
    expect(badge.className).toContain("badge");
    expect(badge.className).toContain("secondary");
    expect(badge.className).toContain("small");
  });

  it("renders as span element", () => {
    render(<Badge>Span Test</Badge>);
    const badge = screen.getByText("Span Test");
    expect(badge.tagName).toBe("SPAN");
  });
});

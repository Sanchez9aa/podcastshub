import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "@/shared/components/ui/Skeleton/Skeleton";

describe("Skeleton", () => {
  it("renders with default styles", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.className).toContain("skeleton");
    expect(skeleton).toHaveStyle({
      width: "100%",
      height: "20px",
      borderRadius: "4px",
    });
  });

  it("renders with custom width", () => {
    const { container } = render(<Skeleton width="200px" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ width: "200px" });
  });

  it("renders with custom height", () => {
    const { container } = render(<Skeleton height="40px" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ height: "40px" });
  });

  it("renders with custom border radius", () => {
    const { container } = render(<Skeleton borderRadius="8px" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ borderRadius: "8px" });
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain("skeleton");
    expect(skeleton.className).toContain("custom-skeleton");
  });

  it("renders with all custom properties", () => {
    const { container } = render(
      <Skeleton
        width="150px"
        height="30px"
        borderRadius="12px"
        className="custom"
      />,
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain("skeleton");
    expect(skeleton.className).toContain("custom");
    expect(skeleton).toHaveStyle({
      width: "150px",
      height: "30px",
      borderRadius: "12px",
    });
  });
});

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SanitizedDescription } from "@/features/podcast-detail/components/SanitizedDescription/SanitizedDescription";

// Mock the sanitizeHtml utility
vi.mock("@/shared/utils/sanitizeHtml", () => ({
  sanitizeHtml: vi.fn((content: string) => content),
}));

const { sanitizeHtml } = await import("@/shared/utils/sanitizeHtml");

describe("SanitizedDescription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sanitized content", () => {
    const content = "<p>Test content</p>";
    const sanitizedContent = "<p>Sanitized content</p>";

    vi.mocked(sanitizeHtml).mockReturnValue(sanitizedContent);

    const { container } = render(<SanitizedDescription content={content} />);

    expect(sanitizeHtml).toHaveBeenCalledWith(content);
    expect(container.innerHTML).toContain("Sanitized content");
  });

  it("applies default maxHeight as auto", () => {
    const { container } = render(
      <SanitizedDescription content="<p>Test</p>" />,
    );

    const contentDiv = container.firstChild as HTMLElement;
    expect(contentDiv).toHaveStyle({ maxHeight: "auto" });
  });

  it("applies custom maxHeight", () => {
    const { container } = render(
      <SanitizedDescription content="<p>Test</p>" maxHeight="200px" />,
    );

    const contentDiv = container.firstChild as HTMLElement;
    expect(contentDiv).toHaveStyle({ maxHeight: "200px" });
  });

  it("applies correct CSS class", () => {
    const { container } = render(
      <SanitizedDescription content="<p>Test</p>" />,
    );

    expect((container.firstChild as HTMLElement)?.className).toContain(
      "content",
    );
  });

  it("handles HTML content correctly", () => {
    const htmlContent = "<p>Paragraph</p><strong>Bold text</strong>";
    vi.mocked(sanitizeHtml).mockReturnValue(htmlContent);

    const { container } = render(
      <SanitizedDescription content={htmlContent} />,
    );

    expect(sanitizeHtml).toHaveBeenCalledWith(htmlContent);
    expect(container.innerHTML).toContain(htmlContent);
  });

  it("handles plain text content", () => {
    const plainText = "Plain text content";
    vi.mocked(sanitizeHtml).mockReturnValue(plainText);

    const { container } = render(<SanitizedDescription content={plainText} />);

    expect(sanitizeHtml).toHaveBeenCalledWith(plainText);
    expect(container.innerHTML).toContain(plainText);
  });

  it("handles empty content", () => {
    const emptyContent = "";
    vi.mocked(sanitizeHtml).mockReturnValue(emptyContent);

    const { container } = render(
      <SanitizedDescription content={emptyContent} />,
    );

    expect(sanitizeHtml).toHaveBeenCalledWith(emptyContent);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("calls sanitizeHtml function with correct content", () => {
    const content = "<script>alert('test')</script><p>Safe content</p>";

    render(<SanitizedDescription content={content} />);

    expect(sanitizeHtml).toHaveBeenCalledTimes(1);
    expect(sanitizeHtml).toHaveBeenCalledWith(content);
  });
});

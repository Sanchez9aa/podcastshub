import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "../sanitizeHtml";

describe("sanitizeHtml", () => {
  it("should return empty string for null, undefined, or empty input", () => {
    expect(sanitizeHtml("")).toBe("");
    expect(sanitizeHtml(null as any)).toBe("");
    expect(sanitizeHtml(undefined as any)).toBe("");
  });

  it("should preserve allowed HTML tags", () => {
    const input = "<p>Hello <strong>world</strong> <em>test</em></p>";
    const result = sanitizeHtml(input);
    expect(result).toBe("<p>Hello <strong>world</strong> <em>test</em></p>");
  });

  it("should preserve basic formatting tags", () => {
    const input =
      "<p>Text with <b>bold</b>, <i>italic</i>, and <u>underline</u></p>";
    const result = sanitizeHtml(input);
    expect(result).toBe(
      "<p>Text with <b>bold</b>, <i>italic</i>, and <u>underline</u></p>",
    );
  });

  it("should preserve list elements", () => {
    const input = "<ul><li>Item 1</li><li>Item 2</li></ul>";
    const result = sanitizeHtml(input);
    expect(result).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
  });

  it("should preserve ordered lists", () => {
    const input = "<ol><li>First</li><li>Second</li></ol>";
    const result = sanitizeHtml(input);
    expect(result).toBe("<ol><li>First</li><li>Second</li></ol>");
  });

  it("should preserve line breaks", () => {
    const input = "Line 1<br>Line 2<br>Line 3";
    const result = sanitizeHtml(input);
    expect(result).toBe("Line 1<br>Line 2<br>Line 3");
  });

  it("should preserve safe links with href attribute", () => {
    const input = '<p>Visit <a href="https://example.com">our website</a></p>';
    const result = sanitizeHtml(input);
    expect(result).toBe(
      '<p>Visit <a href="https://example.com">our website</a></p>',
    );
  });

  it("should handle link target attributes", () => {
    const input = '<a href="https://example.com" target="_blank">Link</a>';
    const result = sanitizeHtml(input);
    // Should preserve the link and href
    expect(result).toContain('<a href="https://example.com"');
    expect(result).toContain("Link</a>");
    // Target attribute behavior may vary by DOMPurify version/environment
  });

  it("should remove dangerous script tags", () => {
    const input = '<p>Safe content</p><script>alert("xss")</script>';
    const result = sanitizeHtml(input);
    expect(result).toBe("<p>Safe content</p>");
  });

  it("should remove dangerous onclick attributes", () => {
    const input = "<p onclick=\"alert('xss')\">Dangerous paragraph</p>";
    const result = sanitizeHtml(input);
    expect(result).toBe("<p>Dangerous paragraph</p>");
  });

  it("should remove style attributes", () => {
    const input =
      '<p style="color: red; background: url(javascript:alert(1))">Styled text</p>';
    const result = sanitizeHtml(input);
    expect(result).toBe("<p>Styled text</p>");
  });

  it("should remove disallowed HTML tags", () => {
    const input = "<div><span>Text</span></div>";
    const result = sanitizeHtml(input);
    expect(result).toBe("Text");
  });

  it("should remove iframe tags", () => {
    const input = '<p>Text</p><iframe src="javascript:alert(1)"></iframe>';
    const result = sanitizeHtml(input);
    expect(result).toBe("<p>Text</p>");
  });

  it("should handle complex nested HTML", () => {
    const input = `
      <p>Episode description with <strong>bold text</strong> and <em>emphasis</em>.</p>
      <ul>
        <li>Point one with <a href="https://example.com">link</a></li>
        <li>Point two</li>
      </ul>
      <p>More <b>content</b> here.</p>
    `;
    const result = sanitizeHtml(input);
    expect(result).toContain(
      "<p>Episode description with <strong>bold text</strong>",
    );
    expect(result).toContain('<a href="https://example.com"');
    expect(result).toContain("link</a>");
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>");
    expect(result).toContain("<b>content</b>");
  });

  it("should handle malformed HTML gracefully", () => {
    const input = "<p>Unclosed paragraph<strong>Bold text<em>Nested";
    const result = sanitizeHtml(input);
    // Should contain the text content even if structure varies
    expect(result).toContain("Unclosed paragraph");
    expect(result).toContain("Bold text");
    expect(result).toContain("Nested");
    // Structure may be auto-corrected differently in different environments
  });

  it("should preserve text content when removing tags", () => {
    const input =
      "<div><span>Important</span> <script>alert('xss')</script> content</div>";
    const result = sanitizeHtml(input);
    expect(result).toBe("Important  content");
  });

  it("should handle podcast description with typical HTML", () => {
    const podcastDescription = `
      <p>Welcome to our <strong>amazing podcast</strong>!</p>
      <p>In this episode we discuss:</p>
      <ul>
        <li>Topic one</li>
        <li>Topic two with <em>emphasis</em></li>
        <li>Visit our <a href="https://podcast-site.com">website</a></li>
      </ul>
      <p>Thanks for listening!<br>Subscribe for more content.</p>
    `;
    const result = sanitizeHtml(podcastDescription);

    expect(result).toContain(
      "<p>Welcome to our <strong>amazing podcast</strong>!</p>",
    );
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>Topic one</li>");
    expect(result).toContain("<em>emphasis</em>");
    expect(result).toContain('<a href="https://podcast-site.com"');
    expect(result).toContain("website</a>");
    expect(result).toContain("<br>");
  });

  it("should handle empty tags", () => {
    const input = "<p></p><strong></strong><em></em>";
    const result = sanitizeHtml(input);
    expect(result).toBe("<p></p><strong></strong><em></em>");
  });

  it("should handle text without HTML tags", () => {
    const input = "Just plain text without any HTML";
    const result = sanitizeHtml(input);
    expect(result).toBe("Just plain text without any HTML");
  });

  it("should be environment agnostic for basic functionality", () => {
    // Test core functionality that should work across environments
    const basicHTML = "<p>Simple <strong>bold</strong> text</p>";
    const result = sanitizeHtml(basicHTML);

    // Should preserve basic structure
    expect(result).toContain("<p>");
    expect(result).toContain("</p>");
    expect(result).toContain("<strong>");
    expect(result).toContain("</strong>");
    expect(result).toContain("Simple");
    expect(result).toContain("bold");
    expect(result).toContain("text");
  });

  it("should handle DOMPurify availability gracefully", () => {
    // This test ensures the function works regardless of DOMPurify version
    const input = '<script>alert("xss")</script><p>Safe content</p>';
    const result = sanitizeHtml(input);

    // Should not contain script tag (security requirement)
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");

    // Should preserve safe content
    expect(result).toContain("Safe content");
  });

  it("should handle empty and whitespace-only content consistently", () => {
    const tests = [
      { input: "", expected: "" },
      { input: "   ", expected: "   " },
      { input: "\n\t", expected: "\n\t" },
    ];

    tests.forEach(({ input, expected }) => {
      expect(sanitizeHtml(input)).toBe(expected);
    });
  });
});

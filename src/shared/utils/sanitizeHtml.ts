import DOMPurify from "dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks while preserving basic formatting
 * Used for podcast descriptions and episode content from external APIs
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Configure DOMPurify to allow safe HTML tags commonly used in podcast descriptions
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "a",
    ],
    ALLOWED_ATTR: ["href", "target"],
    // Ensure links open in new tab for safety
    ADD_ATTR: ["target"],
  });

  return cleanHtml;
}

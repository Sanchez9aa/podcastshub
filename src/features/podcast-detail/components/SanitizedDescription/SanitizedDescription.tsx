import styles from "@/features/podcast-detail/components/SanitizedDescription/SanitizedDescription.module.css";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";

interface ExpandableDescriptionProps {
  content: string;
  maxHeight?: string;
}

export function SanitizedDescription({
  content,
  maxHeight = "auto",
}: ExpandableDescriptionProps) {
  const sanitizedContent = sanitizeHtml(content);

  return (
    <div
      className={styles.content}
      style={{ maxHeight }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized by component
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

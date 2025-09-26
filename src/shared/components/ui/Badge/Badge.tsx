import styles from "@/shared/components/ui/Badge/Badge.module.css";
import type { BadgeProps } from "@/shared/components/ui/Badge/types";

export function Badge({
  children,
  variant = "primary",
  size = "medium",
}: BadgeProps) {
  const className = `${styles.badge} ${styles[variant]} ${styles[size]}`;

  return <span className={className}>{children}</span>;
}

import styles from "./Badge.module.css";
import type { BadgeProps } from "./types";

export function Badge({
  children,
  variant = "primary",
  size = "medium",
}: BadgeProps) {
  const className = `${styles.badge} ${styles[variant]} ${styles[size]}`;

  return <span className={className}>{children}</span>;
}

import styles from "@/shared/components/ui/Spinner/Spinner.module.css";
import type { SpinnerProps } from "@/shared/components/ui/Spinner/types";

export function Spinner({ size = "medium", className }: SpinnerProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="status" is semantically correct for loading spinners, <output> is for calculation results
    <div
      className={`${styles.spinner} ${styles[size]} ${className || ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading..."
    >
      <div aria-hidden="true" className={styles.circle}></div>
    </div>
  );
}

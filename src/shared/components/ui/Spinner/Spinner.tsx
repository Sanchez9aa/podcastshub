import styles from "@/shared/components/ui/Spinner/Spinner.module.css";
import type { SpinnerProps } from "@/shared/components/ui/Spinner/types";

export function Spinner({ size = "medium", className }: SpinnerProps) {
  return (
    <output
      className={`${styles.spinner} ${styles[size]} ${className || ""}`}
      aria-label="Cargando..."
    >
      <div className={styles.circle}></div>
    </output>
  );
}

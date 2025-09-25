import styles from "./Spinner.module.css";
import type { SpinnerProps } from "./types";

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

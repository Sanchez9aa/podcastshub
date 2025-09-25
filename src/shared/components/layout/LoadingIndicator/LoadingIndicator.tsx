import { Spinner } from "@/shared/components/ui/Spinner/Spinner";
import styles from "./LoadingIndicator.module.css";

export function LoadingIndicator() {
  return (
    <div className={styles.indicator}>
      <Spinner size="small" />
    </div>
  );
}

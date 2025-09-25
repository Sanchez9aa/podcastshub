import { Skeleton } from "@/shared/components/ui/Skeleton/Skeleton";
import styles from "./PodcastCardSkeleton.module.css";

export function PodcastCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton height="200px" borderRadius="8px" className={styles.image} />
      <div className={styles.content}>
        <Skeleton height="18px" width="80%" className={styles.title} />
        <Skeleton height="14px" width="60%" className={styles.artist} />
      </div>
    </div>
  );
}

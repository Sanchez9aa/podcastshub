import { PodcastCardSkeleton } from "./PodcastCardSkeleton";
import styles from "./PodcastGridSkeleton.module.css";

interface PodcastGridSkeletonProps {
  count?: number;
}

export function PodcastGridSkeleton({ count = 12 }: PodcastGridSkeletonProps) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static and don't reorder
        <PodcastCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

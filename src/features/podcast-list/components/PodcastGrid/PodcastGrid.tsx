import { PodcastCard } from "@/features/podcast-list/components/PodcastCard/PodcastCard";
import styles from "@/features/podcast-list/components/PodcastGrid/PodcastGrid.module.css";
import { PodcastGridSkeleton } from "@/features/podcast-list/components/PodcastGridSkeleton/PodcastGridSkeleton";
import type { PodcastGridProps } from "@/features/podcast-list/types";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

export function PodcastGrid({
  podcasts,
  isLoading,
  hasMore = false,
  onLoadMore,
}: PodcastGridProps) {
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || false,
    onLoadMore: onLoadMore || (() => {}),
  });

  if (isLoading && podcasts.length === 0) {
    return <PodcastGridSkeleton count={20} />;
  }

  if (podcasts.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <p>No podcasts found matching your search.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className={styles.loadingTrigger}>
          <div className={styles.loadingMore}>
            <div className={styles.spinner} />
            <p>Loading more podcasts...</p>
          </div>
        </div>
      )}
    </>
  );
}

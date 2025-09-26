import styles from "@/features/podcast-detail/components/PodcastDetailSkeleton/PodcastDetailSkeleton.module.css";

export function PodcastDetailSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Sidebar Skeleton */}
        <aside className={styles.sidebar}>
          <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeleton} ${styles.skeletonArtist}`} />
          <div className={`${styles.skeleton} ${styles.skeletonDescLabel}`} />
          <div className={`${styles.skeleton} ${styles.skeletonDesc1}`} />
          <div className={`${styles.skeleton} ${styles.skeletonDesc2}`} />
          <div className={`${styles.skeleton} ${styles.skeletonDesc3}`} />
        </aside>

        {/* Main Content Skeleton */}
        <div className={styles.mainContent}>
          {/* Episode Count Header Skeleton */}
          <div className={styles.episodeCountHeader}>
            <div
              className={`${styles.skeleton} ${styles.skeletonEpisodeCount}`}
            />
          </div>

          {/* Episode List Skeleton */}
          <div className={styles.episodeListContainer}>
            {/* Table Header Skeleton */}
            <div className={styles.skeletonTableHeader}>
              <div
                className={`${styles.skeleton} ${styles.skeletonHeaderCell}`}
              />
              <div
                className={`${styles.skeleton} ${styles.skeletonHeaderCell}`}
              />
              <div
                className={`${styles.skeleton} ${styles.skeletonHeaderCell}`}
              />
            </div>

            {/* Episode Rows Skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton rows don't need unique keys
              <div key={index} className={styles.skeletonRow}>
                <div className={`${styles.skeleton} ${styles.skeletonCell}`} />
                <div className={`${styles.skeleton} ${styles.skeletonCell}`} />
                <div className={`${styles.skeleton} ${styles.skeletonCell}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

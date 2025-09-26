import styles from "@/features/episode-detail/components/EpisodeDetailSkeleton/EpisodeDetailSkeleton.module.css";

export function EpisodeDetailSkeleton() {
  return (
    <div className={styles.container}>
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
      <main className={styles.main}>
        {/* Episode Title Skeleton */}
        <div className={`${styles.skeleton} ${styles.skeletonEpisodeTitle}`} />
        <div
          className={`${styles.skeleton} ${styles.skeletonEpisodeTitleShort}`}
        />

        {/* Episode Description Skeleton */}
        <div className={styles.descriptionSkeleton}>
          <div className={`${styles.skeleton} ${styles.skeletonDescLine}`} />
          <div className={`${styles.skeleton} ${styles.skeletonDescLine}`} />
          <div className={`${styles.skeleton} ${styles.skeletonDescLine}`} />
          <div
            className={`${styles.skeleton} ${styles.skeletonDescLineShort}`}
          />
        </div>

        {/* Audio Player Skeleton */}
        <div className={styles.audioSkeleton}>
          <div className={`${styles.skeleton} ${styles.skeletonAudioPlayer}`} />
        </div>
      </main>
    </div>
  );
}

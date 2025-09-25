import styles from "@/shared/components/ui/PageSkeleton/PageSkeleton.module.css";

export function PageSkeleton() {
  return (
    <div className={styles.container}>
      {/* Header with search and badge */}
      <div className={styles.header}>
        <div className={`${styles.skeleton} ${styles.searchBox}`} />
        <div className={`${styles.skeleton} ${styles.headerBadge}`} />
      </div>

      {/* Main content grid */}
      <div className={styles.mainContent}>
        {Array.from({ length: 12 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton cards don't need unique keys
          <div key={index} className={styles.card} data-testid="skeleton-card">
            <div className={`${styles.skeleton} ${styles.cardImage}`} />
            <div className={`${styles.skeleton} ${styles.cardTitle}`} />
            <div className={`${styles.skeleton} ${styles.cardSubtitle}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

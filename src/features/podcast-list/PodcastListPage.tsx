import { PodcastGrid } from "@/features/podcast-list/components/PodcastGrid/PodcastGrid";
import { SearchFilter } from "@/features/podcast-list/components/SearchFilter/SearchFilter";
import { usePodcastList } from "@/features/podcast-list/hooks/usePodcastList";
import styles from "@/features/podcast-list/PodcastListPage.module.css";
import { Badge } from "@/shared/components/ui/Badge/Badge";

export function PodcastListPage() {
  const {
    podcasts,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    podcastCount,
    totalFilteredCount,
    hasMore,
    loadMore,
  } = usePodcastList();

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error loading podcasts</h1>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.controlsRow}>
          <SearchFilter
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Filter podcasts..."
          />
          {!isLoading && (
            <Badge variant="primary">
              {podcastCount}
              {hasMore && totalFilteredCount > podcastCount
                ? ` of ${totalFilteredCount}`
                : ""}
            </Badge>
          )}
        </div>
      </div>

      <main>
        <PodcastGrid
          podcasts={podcasts}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </main>
    </div>
  );
}

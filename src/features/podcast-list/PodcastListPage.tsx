import { Badge } from "@/shared/components/ui/Badge";
import { PodcastGrid } from "./components/PodcastGrid";
import { SearchFilter } from "./components/SearchFilter";
import { usePodcastList } from "./hooks/usePodcastList";
import styles from "./PodcastListPage.module.css";

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

import { useParams } from "react-router";
import { EpisodeList } from "@/features/podcast-detail/components/EpisodeList/EpisodeList";
import { PodcastDetailSkeleton } from "@/features/podcast-detail/components/PodcastDetailSkeleton/PodcastDetailSkeleton";
import { usePodcastDetail } from "@/features/podcast-detail/hooks/usePodcastDetail";
import styles from "@/features/podcast-detail/PodcastDetailPage.module.css";
import { PodcastInfo } from "@/shared/components/PodcastInfo/PodcastInfo";

export function PodcastDetailPage() {
  const { podcastId } = useParams<{ podcastId: string }>();
  const {
    data: podcastDetail,
    isLoading,
    error,
  } = usePodcastDetail(podcastId || "");

  if (!podcastId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer} role="alert">
          <p className={styles.errorMessage}>Podcast ID not found</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PodcastDetailSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer} role="alert">
          <p className={styles.errorMessage}>
            Error loading podcast:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!podcastDetail) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer} role="alert">
          <p className={styles.errorMessage}>Podcast not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <aside aria-label="Podcast information">
          <PodcastInfo podcast={podcastDetail} />
        </aside>
        <main aria-label="Episode list">
          <EpisodeList
            episodes={podcastDetail.episodes}
            podcastId={podcastId}
          />
        </main>
      </div>
    </div>
  );
}

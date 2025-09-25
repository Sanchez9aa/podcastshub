import { useParams } from "react-router";
import { EpisodeList } from "@/features/podcast-detail/components/EpisodeList";
import { PodcastDetailSkeleton } from "@/features/podcast-detail/components/PodcastDetailSkeleton";
import { PodcastSidebar } from "@/features/podcast-detail/components/PodcastSidebar";
import { usePodcastDetail } from "@/features/podcast-detail/hooks/usePodcastDetail";
import styles from "@/features/podcast-detail/PodcastDetailPage.module.css";

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
        <div className={styles.errorContainer}>
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
        <div className={styles.errorContainer}>
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
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Podcast not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <PodcastSidebar podcast={podcastDetail} />
        <EpisodeList episodes={podcastDetail.episodes} podcastId={podcastId} />
      </div>
    </div>
  );
}

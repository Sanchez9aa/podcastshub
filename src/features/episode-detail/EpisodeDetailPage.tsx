import { useParams } from "react-router";
import { EpisodeDetailSkeleton } from "@/features/episode-detail/components/EpisodeDetailSkeleton/EpisodeDetailSkeleton";
import { EpisodeInfo } from "@/features/episode-detail/components/EpisodeInfo/EpisodeInfo";
import styles from "@/features/episode-detail/EpisodeDetailPage.module.css";
import { usePodcastDetail } from "@/infrastructure/query/podcastQueries";
import { PodcastInfo } from "@/shared/components/PodcastInfo/PodcastInfo";

export function EpisodeDetailPage() {
  const { podcastId, episodeId } = useParams<{
    podcastId: string;
    episodeId: string;
  }>();

  const {
    data: podcastDetail,
    isLoading,
    error,
  } = usePodcastDetail(podcastId || "");

  if (isLoading) {
    return <EpisodeDetailSkeleton />;
  }

  if (error || !podcastDetail) {
    return (
      <div className={styles.error} role="alert">
        Failed to load episode
      </div>
    );
  }

  const episode = podcastDetail.episodes.find((ep) => ep.id === episodeId);

  if (!episode) {
    return (
      <div className={styles.error} role="alert">
        Episode not found
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar} aria-label="Podcast information">
        <PodcastInfo podcast={podcastDetail} podcastId={podcastId} />
      </aside>
      <main className={styles.main} aria-labelledby="episode-title">
        <EpisodeInfo episode={episode} />
      </main>
    </div>
  );
}

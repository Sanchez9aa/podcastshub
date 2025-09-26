import { Link } from "react-router";
import type { Podcast } from "@/core/entities/Podcast";
import { SanitizedDescription } from "@/features/podcast-detail/components/SanitizedDescription/SanitizedDescription";
import styles from "@/shared/components/PodcastInfo/PodcastInfo.module.css";

interface PodcastInfoProps {
  podcast: Podcast;
  podcastId?: string;
}

export function PodcastInfo({ podcast, podcastId }: PodcastInfoProps) {
  const podcastDetailPath = `/podcast/${podcastId || podcast.id}`;

  return (
    <aside className={styles.sidebar}>
      {podcastId ? (
        <Link to={podcastDetailPath}>
          <img
            src={podcast.image}
            alt={podcast.name}
            className={styles.podcastImage}
          />
        </Link>
      ) : (
        <img
          src={podcast.image}
          alt={podcast.name}
          className={styles.podcastImage}
        />
      )}

      {podcastId ? (
        <Link to={podcastDetailPath} className={styles.titleLink}>
          <h2 className={styles.podcastTitle}>{podcast.name}</h2>
        </Link>
      ) : (
        <h2 className={styles.podcastTitle}>{podcast.name}</h2>
      )}

      {podcastId ? (
        <Link to={podcastDetailPath} className={styles.artistLink}>
          <p className={styles.podcastArtist}>by {podcast.artist}</p>
        </Link>
      ) : (
        <p className={styles.podcastArtist}>by {podcast.artist}</p>
      )}

      <h3 className={styles.descriptionLabel}>Description:</h3>
      <SanitizedDescription content={podcast.summary} maxHeight="425px" />
    </aside>
  );
}

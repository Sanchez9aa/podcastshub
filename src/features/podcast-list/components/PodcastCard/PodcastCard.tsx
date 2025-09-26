import { Link } from "react-router";
import styles from "@/features/podcast-list/components/PodcastCard/PodcastCard.module.css";
import type { PodcastCardProps } from "@/features/podcast-list/types";

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link
      to={`/podcast/${podcast.id}`}
      className={styles.card}
      aria-label={`View ${podcast.name} podcast by ${podcast.artist}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={podcast.image}
          alt={`Cover art for ${podcast.name} podcast`}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{podcast.name}</h3>
        <p className={styles.artist}>Author: {podcast.artist}</p>
      </div>
    </Link>
  );
}

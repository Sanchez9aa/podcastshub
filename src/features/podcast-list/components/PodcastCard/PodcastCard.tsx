import { Link } from "react-router";
import styles from "@/features/podcast-list/components/PodcastCard/PodcastCard.module.css";
import type { PodcastCardProps } from "@/features/podcast-list/types";

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link to={`/podcast/${podcast.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${podcast.image})`,
          }}
          role="img"
          aria-label={`${podcast.name} cover`}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{podcast.name}</h3>
        <p className={styles.artist}>Author: {podcast.artist}</p>
      </div>
    </Link>
  );
}

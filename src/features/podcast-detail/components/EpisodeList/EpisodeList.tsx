import { Link } from "react-router";
import type { Episode } from "@/core/entities/Episode";
import styles from "@/features/podcast-detail/components/EpisodeList/EpisodeList.module.css";
import { formatDate } from "@/shared/utils/formatDate";
import { formatDuration } from "@/shared/utils/formatDuration";

interface EpisodeListProps {
  episodes: Episode[];
  podcastId: string;
}

export function EpisodeList({ episodes, podcastId }: EpisodeListProps) {
  return (
    <div className={styles.mainContent}>
      <div className={styles.episodeCountHeader}>
        <h2 className={styles.episodeCount}>Episodes: {episodes.length}</h2>
      </div>

      <div className={styles.episodeListContainer}>
        <table className={styles.episodeTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Title</th>
              <th className={styles.tableHeaderCell}>Date</th>
              <th className={styles.tableHeaderCell}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode) => (
              <tr key={episode.id} className={styles.episodeRow}>
                <td className={styles.episodeCell}>
                  <Link
                    to={`/podcast/${podcastId}/episode/${episode.id}`}
                    className={styles.episodeTitle}
                  >
                    {episode.title}
                  </Link>
                </td>
                <td className={`${styles.episodeCell} ${styles.episodeDate}`}>
                  {formatDate(episode.releaseDate)}
                </td>
                <td
                  className={`${styles.episodeCell} ${styles.episodeDuration}`}
                >
                  {formatDuration(episode.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

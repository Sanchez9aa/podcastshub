import type { Podcast } from "@/core/entities/Podcast";
import styles from "@/features/podcast-detail/components/PodcastSidebar.module.css";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";

interface PodcastSidebarProps {
  podcast: Podcast;
}

export function PodcastSidebar({ podcast }: PodcastSidebarProps) {
  const sanitizedSummary = sanitizeHtml(podcast.summary);

  return (
    <aside className={styles.sidebar}>
      <img
        src={podcast.image}
        alt={podcast.name}
        className={styles.podcastImage}
      />
      <h2 className={styles.podcastTitle}>{podcast.name}</h2>
      <p className={styles.podcastArtist}>by {podcast.artist}</p>

      <h3 className={styles.descriptionLabel}>Description:</h3>
      <p
        className={styles.podcastDescription}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized with DOMPurify
        dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
      />
    </aside>
  );
}

import styles from "@/features/episode-detail/components/EpisodeInfo/EpisodeInfo.module.css";
import { useAudioMetadata } from "@/features/episode-detail/hooks/useAudioMetadata";
import type { EpisodeInfoProps } from "@/features/episode-detail/types/EpisodeInfoTypes";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";

export function EpisodeInfo({ episode }: EpisodeInfoProps) {
  const { hasError, onError } = useAudioMetadata();
  const sanitizedDescription = sanitizeHtml(episode.description);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{episode.title}</h1>

      <div
        className={styles.description}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized with DOMPurify
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />

      <div className={styles.audioContainer}>
        {episode.audioUrl ? (
          <>
            {/* biome-ignore lint/a11y/useMediaCaption: No captions available for podcast episodes */}
            <audio
              controls
              className={styles.audioPlayer}
              preload="none"
              onError={onError}
            >
              <source src={episode.audioUrl} type="audio/mpeg" />
              <source src={episode.audioUrl} type="audio/mp4" />
              <source src={episode.audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            {hasError && (
              <div className={styles.audioError}>
                <p>Failed to load audio</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noAudio}>
            <p>Audio not available for this episode</p>
          </div>
        )}
      </div>
    </div>
  );
}

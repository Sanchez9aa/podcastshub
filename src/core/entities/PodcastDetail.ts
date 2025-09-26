import type { Episode } from "@/core/entities/Episode";
import type { Podcast } from "@/core/entities/Podcast";

export interface PodcastDetail extends Podcast {
  episodes: Episode[];
}

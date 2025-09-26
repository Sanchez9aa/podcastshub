import type { Podcast } from "@/core/entities/Podcast";
import type { PodcastDetail } from "@/core/entities/PodcastDetail";

export interface PodcastRepository {
  getPodcasts(): Promise<Podcast[]>;
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>;
}

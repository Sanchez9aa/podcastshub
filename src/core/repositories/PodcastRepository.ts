import type { Podcast } from "../entities/Podcast";
import type { PodcastDetail } from "../entities/PodcastDetail";

export interface PodcastRepository {
  getPodcasts(): Promise<Podcast[]>;
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>;
}

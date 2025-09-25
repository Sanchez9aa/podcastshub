import type { Podcast } from "@/core/entities/Podcast";
import type { PodcastDetail } from "@/core/entities/PodcastDetail";
import type { PodcastRepository } from "@/core/repositories/PodcastRepository";
import { fetchWithProxy } from "@/infrastructure/api/allOriginsProxy";
import type {
  iTunesEntry,
  iTunesLookupResponse,
  iTunesResponse,
} from "@/infrastructure/api/types/iTunesTypes";
import { API_ENDPOINTS } from "@/shared/constants/api";

const getPodcasts = async (): Promise<Podcast[]> => {
  try {
    const response = await fetchWithProxy<iTunesResponse>(
      API_ENDPOINTS.TOP_PODCASTS,
    );

    return response.feed.entry.map((entry: iTunesEntry) => ({
      id: entry.id.attributes["im:id"],
      name: entry["im:name"].label,
      artist: entry["im:artist"].label,
      summary: entry.summary.label,
      image: entry["im:image"][2].label, // Use the largest image
    }));
  } catch (error) {
    console.error("Failed to fetch podcasts:", error);
    throw error;
  }
};

const getPodcastDetail = async (podcastId: string): Promise<PodcastDetail> => {
  try {
    const url = API_ENDPOINTS.PODCAST_DETAIL.replace("{PODCAST_ID}", podcastId);
    const response = await fetchWithProxy<iTunesLookupResponse>(url);

    if (!response.results || response.results.length === 0) {
      throw new Error(`Podcast with ID ${podcastId} not found`);
    }

    const podcastInfo = response.results[0];
    const episodes = response.results.slice(1).map((episode) => ({
      id: episode.trackId?.toString() || episode.collectionId?.toString() || "",
      title: episode.trackName || "",
      description: episode.description || "",
      audioUrl: episode.previewUrl || "",
      duration: episode.trackTimeMillis
        ? Math.floor(episode.trackTimeMillis / 1000)
        : 0,
      releaseDate: episode.releaseDate ? episode.releaseDate.split("T")[0] : "",
      podcastId,
    }));

    return {
      id: podcastInfo.collectionId?.toString() || podcastId,
      name: podcastInfo.collectionName || "",
      artist: podcastInfo.artistName || "",
      summary: podcastInfo.description || "",
      image: podcastInfo.artworkUrl600 || "",
      trackCount: episodes.length,
      episodes,
    };
  } catch (error) {
    console.error(`Failed to fetch podcast detail for ID ${podcastId}:`, error);
    throw error;
  }
};

export const apiPodcastRepository: PodcastRepository = {
  getPodcasts,
  getPodcastDetail,
};

import type { Podcast } from "@/core/entities/Podcast";
import type { PodcastDetail } from "@/core/entities/PodcastDetail";
import type { PodcastRepository } from "@/core/repositories/PodcastRepository";
import { fetchWithProxy } from "@/infrastructure/api/allOriginsProxy";
import type {
  iTunesEntry,
  iTunesEpisodeInfo,
  iTunesLookupResponse,
  iTunesPodcastInfo,
  iTunesResponse,
} from "@/infrastructure/api/types/iTunesTypes";
import { API_ENDPOINTS } from "@/shared/constants/api";

const isPodcastInfo = (item: unknown): item is iTunesPodcastInfo => {
  return (
    typeof item === "object" &&
    item !== null &&
    "wrapperType" in item &&
    "kind" in item &&
    item.wrapperType === "track" &&
    item.kind === "podcast"
  );
};

const isEpisodeInfo = (item: unknown): item is iTunesEpisodeInfo => {
  return (
    typeof item === "object" &&
    item !== null &&
    "wrapperType" in item &&
    "kind" in item &&
    item.wrapperType === "podcastEpisode" &&
    item.kind === "podcast-episode"
  );
};

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

    const podcastInfo = response.results.find(isPodcastInfo);
    if (!podcastInfo) {
      throw new Error(`Podcast info not found for ID ${podcastId}`);
    }

    const episodes = response.results
      .filter(isEpisodeInfo)
      .map((episode: iTunesEpisodeInfo) => ({
        id: episode.trackId.toString(),
        title: episode.trackName,
        description: episode.description,
        audioUrl: episode.previewUrl || episode.episodeUrl || "",
        duration: episode.trackTimeMillis
          ? Math.floor(episode.trackTimeMillis / 1000)
          : 0,
        releaseDate: episode.releaseDate.split("T")[0],
        podcastId,
      }));

    return {
      id: podcastInfo.collectionId.toString(),
      name: podcastInfo.collectionName,
      artist: podcastInfo.artistName,
      summary: podcastInfo.collectionName, // Using collectionName as summary since description is not available
      image: podcastInfo.artworkUrl600,
      trackCount: podcastInfo.trackCount,
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

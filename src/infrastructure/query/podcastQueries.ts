import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Podcast } from "@/core/entities/Podcast";
import { apiPodcastRepository } from "@/infrastructure/repositories/ApiPodcastRepository";
import { CACHE_CONFIG } from "@/shared/constants/api";

export const QUERY_KEYS = {
  PODCASTS: ["podcasts"] as const,
  PODCAST_DETAIL: (id: string) => ["podcast", "detail", id] as const,
} as const;

export const usePodcasts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PODCASTS,
    queryFn: apiPodcastRepository.getPodcasts,
    staleTime: CACHE_CONFIG.TTL_24_HOURS,
    gcTime: CACHE_CONFIG.TTL_24_HOURS,
  });
};

export const usePodcastDetail = (podcastId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: QUERY_KEYS.PODCAST_DETAIL(podcastId),
    queryFn: async () => {
      // Get podcast summary from podcasts cache
      const podcastsData = queryClient.getQueryData(QUERY_KEYS.PODCASTS) as
        | Podcast[]
        | undefined;
      const podcastFromList = podcastsData?.find((p) => p.id === podcastId);

      const podcastDetail =
        await apiPodcastRepository.getPodcastDetail(podcastId);

      // Use summary from list if available, otherwise use fallback from detail
      return {
        ...podcastDetail,
        summary: podcastFromList?.summary || podcastDetail.summary,
      };
    },
    staleTime: CACHE_CONFIG.TTL_24_HOURS,
    gcTime: CACHE_CONFIG.TTL_24_HOURS,
    enabled: !!podcastId,
  });
};

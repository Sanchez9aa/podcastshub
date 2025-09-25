import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { filterPodcasts } from "@/core/use-cases/filterPodcasts";
import { apiPodcastRepository } from "@/infrastructure/repositories/ApiPodcastRepository";
import { PAGINATION } from "@/shared/constants/pagination";

export function usePodcastList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState<number>(
    PAGINATION.INITIAL_LOAD,
  );

  const {
    data: allPodcasts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["podcasts"],
    queryFn: () => apiPodcastRepository.getPodcasts(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const filteredPodcasts = useMemo(() => {
    if (!searchTerm.trim()) return allPodcasts;
    return filterPodcasts(allPodcasts, searchTerm);
  }, [allPodcasts, searchTerm]);

  const displayedPodcasts = useMemo(() => {
    return filteredPodcasts.slice(0, visibleCount);
  }, [filteredPodcasts, visibleCount]);

  // Reset visible count when search changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to reset pagination when search changes
  useEffect(() => {
    setVisibleCount(PAGINATION.INITIAL_LOAD);
  }, [searchTerm]);

  const hasMore = visibleCount < filteredPodcasts.length;
  const totalCount = filteredPodcasts.length;

  const loadMore = () => {
    if (hasMore) {
      setVisibleCount((prev) =>
        Math.min(prev + PAGINATION.LOAD_INCREMENT, filteredPodcasts.length),
      );
    }
  };

  return {
    podcasts: displayedPodcasts,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    podcastCount: displayedPodcasts.length,
    totalFilteredCount: totalCount,
    hasMore,
    loadMore,
  };
}

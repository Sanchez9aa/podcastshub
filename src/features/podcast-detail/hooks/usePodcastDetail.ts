import { useEffect } from "react";
import { usePodcastDetail as useApiPodcastDetail } from "@/infrastructure/query/podcastQueries";
import { useUI } from "@/shared/context/UIContext";

export function usePodcastDetail(podcastId: string) {
  const query = useApiPodcastDetail(podcastId);
  const { setLoading } = useUI();

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
}

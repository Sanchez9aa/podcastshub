import type { Podcast } from "../entities/Podcast";

export function filterPodcasts(
  podcasts: Podcast[],
  searchTerm: string,
): Podcast[] {
  if (!searchTerm.trim()) {
    return podcasts;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return podcasts.filter(
    (podcast) =>
      podcast.name.toLowerCase().includes(lowerSearchTerm) ||
      podcast.artist.toLowerCase().includes(lowerSearchTerm),
  );
}

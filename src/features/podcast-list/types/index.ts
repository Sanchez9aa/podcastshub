import type { Podcast } from "@/core/entities/Podcast";

export interface PodcastCardProps {
  podcast: Podcast;
}

export interface PodcastGridProps {
  podcasts: Podcast[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

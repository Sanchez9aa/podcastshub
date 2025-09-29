import type { Podcast } from "@/core/entities/Podcast";

// Large dataset for pagination testing
export const createLargePodcastList = (count: number): Podcast[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: `Podcast ${i + 1}`,
    artist: "Author",
    summary: "Summary",
    image: `https://example.com/image${i + 1}.jpg`,
  }));

// Hook options fixtures
export const defaultInfiniteScrollOptions = {
  hasMore: true,
  isLoading: false,
  onLoadMore: () => {},
};

export const mockLocationFixture = {
  pathname: "/",
  search: "",
  hash: "",
  state: null,
  key: "default",
};

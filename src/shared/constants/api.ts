export const API_ENDPOINTS = {
  TOP_PODCASTS:
    "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json",
  PODCAST_DETAIL:
    "https://itunes.apple.com/lookup?id={PODCAST_ID}&media=podcast&entity=podcastEpisode&limit=20",
  PROXY_BASE: "https://api.allorigins.win/get?url=",
} as const;

export const CACHE_KEYS = {
  PODCASTER_CACHE: "PODCASTER_CACHE",
  REACT_QUERY_OFFLINE_CACHE: "REACT_QUERY_OFFLINE_CACHE",
} as const;

export const CACHE_CONFIG = {
  TTL_24_HOURS: 24 * 60 * 60 * 1000,
  MAX_RETRIES: 3,
  EPISODES_LIMIT: 20,
} as const;

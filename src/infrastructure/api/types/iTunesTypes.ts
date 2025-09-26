export interface iTunesEntry {
  id: { attributes: { "im:id": string } };
  "im:name": { label: string };
  "im:artist": { label: string };
  summary: { label: string };
  "im:image": Array<{ label: string; attributes: { height: string } }>;
}

export interface iTunesResponse {
  feed: {
    entry: iTunesEntry[];
  };
}

export interface iTunesPodcastInfo {
  wrapperType: "track";
  kind: "podcast";
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  collectionViewUrl: string;
  feedUrl: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl600: string;
  collectionPrice: number;
  trackPrice: number;
  collectionHdPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  trackCount: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  contentAdvisoryRating: string;
  genreIds: string[];
  genres: string[];
}

export interface iTunesEpisodeInfo {
  artworkUrl160: string;
  artworkUrl600: string;
  artworkUrl60: string;
  episodeFileExtension: string;
  episodeContentType: "audio";
  feedUrl: string;
  closedCaptioning: string;
  collectionId: number;
  collectionName: string;
  artistIds: number[];
  genres: Array<{
    name: string;
    id: string;
  }>;
  episodeGuid: string;
  trackName: string;
  trackId: number;
  shortDescription: string;
  releaseDate: string;
  episodeUrl: string;
  kind: "podcast-episode";
  wrapperType: "podcastEpisode";
  description: string;
  country: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  contentAdvisoryRating: string;
  previewUrl: string;
  trackTimeMillis: number;
}

export type iTunesLookupResult = iTunesPodcastInfo | iTunesEpisodeInfo;

export interface iTunesLookupResponse {
  results: iTunesLookupResult[];
}

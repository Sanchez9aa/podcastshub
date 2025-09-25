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

export interface iTunesLookupResult {
  trackId: number;
  collectionId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  description?: string;
  releaseDate: string;
  trackTimeMillis: number;
  previewUrl?: string;
  artworkUrl600?: string;
  kind: string;
}

export interface iTunesLookupResponse {
  results: iTunesLookupResult[];
}

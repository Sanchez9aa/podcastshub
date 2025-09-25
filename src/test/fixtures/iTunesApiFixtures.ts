import type {
  iTunesEntry,
  iTunesLookupResponse,
  iTunesLookupResult,
  iTunesResponse,
} from "@/infrastructure/api/types/iTunesTypes";

// Mock iTunes API Response for top podcasts
const mockiTunesApiResponse: iTunesResponse = {
  feed: {
    entry: [
      {
        id: { attributes: { "im:id": "1574007634" } },
        "im:name": { label: "The Joe Rogan Experience" },
        "im:artist": { label: "Joe Rogan" },
        summary: { label: "The official podcast of comedian Joe Rogan." },
        "im:image": [
          {
            label: "https://example.com/small.jpg",
            attributes: { height: "55" },
          },
          {
            label: "https://example.com/medium.jpg",
            attributes: { height: "60" },
          },
          {
            label: "https://example.com/large.jpg",
            attributes: { height: "170" },
          },
        ],
      },
      {
        id: { attributes: { "im:id": "1535809341" } },
        "im:name": { label: "Crime Junkie" },
        "im:artist": { label: "audiochuck" },
        summary: {
          label:
            "If you can never get enough true crime... Congratulations, you've found your people.",
        },
        "im:image": [
          {
            label: "https://example.com/small2.jpg",
            attributes: { height: "55" },
          },
          {
            label: "https://example.com/medium2.jpg",
            attributes: { height: "60" },
          },
          {
            label: "https://example.com/large2.jpg",
            attributes: { height: "170" },
          },
        ],
      },
      {
        id: { attributes: { "im:id": "1438054347" } },
        "im:name": {
          label:
            "My Favorite Murder with Karen Kilgariff and Georgia Hardstark",
        },
        "im:artist": { label: "Exactly Right" },
        summary: {
          label:
            "Karen Kilgariff and Georgia Hardstark hit the road and go straight to the crimes that made them famous.",
        },
        "im:image": [
          {
            label: "https://example.com/small3.jpg",
            attributes: { height: "55" },
          },
          {
            label: "https://example.com/medium3.jpg",
            attributes: { height: "60" },
          },
          {
            label: "https://example.com/large3.jpg",
            attributes: { height: "170" },
          },
        ],
      },
    ],
  },
};

// Mock iTunes Lookup Response for podcast detail
const mockiTunesLookupResponse: iTunesLookupResponse = {
  results: [
    // First result is always the podcast info
    {
      trackId: 0,
      collectionId: 1574007634,
      trackName: "",
      artistName: "Joe Rogan",
      collectionName: "The Joe Rogan Experience",
      description:
        "The official podcast of comedian Joe Rogan. Follow The Joe Rogan Experience on Spotify.",
      releaseDate: "2024-01-15T10:00:00Z",
      trackTimeMillis: 0,
      previewUrl: undefined,
      artworkUrl600: "https://example.com/artwork600.jpg",
      kind: "podcast",
    },
    // Subsequent results are episodes
    {
      trackId: 2057819234,
      collectionId: 1574007634,
      trackName: "JRE #2057 - Elon Musk",
      artistName: "Joe Rogan",
      collectionName: "The Joe Rogan Experience",
      description: "Elon Musk is a business magnate, investor, and engineer.",
      releaseDate: "2024-01-15T10:00:00Z",
      trackTimeMillis: 10800000, // 3 hours in milliseconds
      previewUrl: "https://example.com/episode1.mp3",
      artworkUrl600: "https://example.com/artwork600.jpg",
      kind: "podcast-episode",
    },
    {
      trackId: 2056789123,
      collectionId: 1574007634,
      trackName: "JRE #2056 - Duncan Trussell",
      artistName: "Joe Rogan",
      collectionName: "The Joe Rogan Experience",
      description:
        "Duncan Trussell is a stand-up comic, writer, actor, host of the Duncan Trussell Family Hour podcast.",
      releaseDate: "2024-01-12T15:30:00Z",
      trackTimeMillis: 7200000, // 2 hours in milliseconds
      previewUrl: "https://example.com/episode2.mp3",
      artworkUrl600: "https://example.com/artwork600.jpg",
      kind: "podcast-episode",
    },
    {
      trackId: 2055678912,
      collectionId: 1574007634,
      trackName: "JRE #2055 - Tim Dillon",
      artistName: "Joe Rogan",
      collectionName: "The Joe Rogan Experience",
      description:
        "Tim Dillon is a stand-up comic, actor, and host of The Tim Dillon Show podcast.",
      releaseDate: "2024-01-10T12:00:00Z",
      trackTimeMillis: 5400000, // 1.5 hours in milliseconds
      previewUrl: "https://example.com/episode3.mp3",
      artworkUrl600: "https://example.com/artwork600.jpg",
      kind: "podcast-episode",
    },
  ],
};

// Mock empty iTunes Lookup Response (podcast not found)
const mockEmptyiTunesLookupResponse: iTunesLookupResponse = {
  results: [],
};

// Mock iTunes Lookup Response with missing fields
const mockiTunesLookupResponseMissingFields: iTunesLookupResponse = {
  results: [
    {
      trackId: 0,
      collectionId: 999,
      trackName: "",
      artistName: "",
      collectionName: "",
      releaseDate: "",
      trackTimeMillis: 0,
      kind: "podcast",
    },
    {
      trackId: 1001,
      collectionId: 999,
      trackName: "",
      artistName: "",
      collectionName: "",
      releaseDate: "",
      trackTimeMillis: 0,
      kind: "podcast-episode",
    },
  ],
};

// Mock iTunes Lookup Response with no episodes (only podcast info)
const mockiTunesLookupResponseNoEpisodes: iTunesLookupResponse = {
  results: [
    {
      trackId: 0,
      collectionId: 1234567890,
      trackName: "",
      artistName: "New Podcaster",
      collectionName: "Brand New Podcast",
      description: "A brand new podcast with no episodes yet",
      releaseDate: "2024-01-01T00:00:00Z",
      trackTimeMillis: 0,
      artworkUrl600: "https://example.com/new-artwork.jpg",
      kind: "podcast",
    },
  ],
};

// Mock iTunes Lookup Response with episode missing trackId (fallback to collectionId)
const mockiTunesLookupResponseMissingTrackId: iTunesLookupResponse = {
  results: [
    {
      trackId: 0,
      collectionId: 5555555555,
      trackName: "",
      artistName: "Test Artist",
      collectionName: "Test Podcast",
      description: "Test podcast description",
      releaseDate: "2024-01-01T00:00:00Z",
      trackTimeMillis: 0,
      artworkUrl600: "https://example.com/test-artwork.jpg",
      kind: "podcast",
    },
    {
      // trackId is missing, should fallback to collectionId
      collectionId: 6666666666,
      trackName: "Episode without trackId",
      artistName: "Test Artist",
      collectionName: "Test Podcast",
      description: "This episode has no trackId",
      releaseDate: "2024-01-01T10:00:00Z",
      trackTimeMillis: 1800000, // 30 minutes
      previewUrl: "https://example.com/no-trackid-episode.mp3",
      kind: "podcast-episode",
    } as iTunesLookupResult, // Type assertion to simulate missing trackId
  ],
};

// Simple mock entries for basic tests
const mockiTunesEntry: iTunesEntry = {
  id: { attributes: { "im:id": "123456789" } },
  "im:name": { label: "Test Podcast" },
  "im:artist": { label: "Test Artist" },
  summary: { label: "Test Summary" },
  "im:image": [
    { label: "https://example.com/55x55.jpg", attributes: { height: "55" } },
    { label: "https://example.com/60x60.jpg", attributes: { height: "60" } },
    { label: "https://example.com/170x170.jpg", attributes: { height: "170" } },
  ],
};

// Expected mapped results for easier testing
const expectedMappedPodcasts = [
  {
    id: "1574007634",
    name: "The Joe Rogan Experience",
    artist: "Joe Rogan",
    summary: "The official podcast of comedian Joe Rogan.",
    image: "https://example.com/large.jpg",
  },
  {
    id: "1535809341",
    name: "Crime Junkie",
    artist: "audiochuck",
    summary:
      "If you can never get enough true crime... Congratulations, you've found your people.",
    image: "https://example.com/large2.jpg",
  },
  {
    id: "1438054347",
    name: "My Favorite Murder with Karen Kilgariff and Georgia Hardstark",
    artist: "Exactly Right",
    summary:
      "Karen Kilgariff and Georgia Hardstark hit the road and go straight to the crimes that made them famous.",
    image: "https://example.com/large3.jpg",
  },
];

const expectedMappedPodcastDetail = {
  id: "1574007634",
  name: "The Joe Rogan Experience",
  artist: "Joe Rogan",
  summary:
    "The official podcast of comedian Joe Rogan. Follow The Joe Rogan Experience on Spotify.",
  image: "https://example.com/artwork600.jpg",
  trackCount: 3,
  episodes: [
    {
      id: "2057819234",
      title: "JRE #2057 - Elon Musk",
      description: "Elon Musk is a business magnate, investor, and engineer.",
      audioUrl: "https://example.com/episode1.mp3",
      duration: 10800, // Converted from milliseconds to seconds
      releaseDate: "2024-01-15",
      podcastId: "1574007634",
    },
    {
      id: "2056789123",
      title: "JRE #2056 - Duncan Trussell",
      description:
        "Duncan Trussell is a stand-up comic, writer, actor, host of the Duncan Trussell Family Hour podcast.",
      audioUrl: "https://example.com/episode2.mp3",
      duration: 7200,
      releaseDate: "2024-01-12",
      podcastId: "1574007634",
    },
    {
      id: "2055678912",
      title: "JRE #2055 - Tim Dillon",
      description:
        "Tim Dillon is a stand-up comic, actor, and host of The Tim Dillon Show podcast.",
      audioUrl: "https://example.com/episode3.mp3",
      duration: 5400,
      releaseDate: "2024-01-10",
      podcastId: "1574007634",
    },
  ],
};

export {
  mockiTunesApiResponse,
  mockiTunesLookupResponse,
  mockEmptyiTunesLookupResponse,
  mockiTunesLookupResponseMissingFields,
  mockiTunesLookupResponseNoEpisodes,
  mockiTunesLookupResponseMissingTrackId,
  mockiTunesEntry,
  expectedMappedPodcasts,
  expectedMappedPodcastDetail,
};

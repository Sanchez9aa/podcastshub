import type {
  iTunesEntry,
  iTunesEpisodeInfo,
  iTunesLookupResponse,
  iTunesPodcastInfo,
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

// Mock iTunes Podcast Info
const mockiTunesPodcastInfo: iTunesPodcastInfo = {
  wrapperType: "track",
  kind: "podcast",
  collectionId: 1574007634,
  trackId: 1574007634,
  artistName: "Joe Rogan",
  collectionName: "The Joe Rogan Experience",
  trackName: "The Joe Rogan Experience",
  collectionCensoredName: "The Joe Rogan Experience",
  trackCensoredName: "The Joe Rogan Experience",
  collectionViewUrl:
    "https://podcasts.apple.com/us/podcast/the-joe-rogan-experience/id1574007634",
  feedUrl: "https://feeds.example.com/jre.xml",
  trackViewUrl:
    "https://podcasts.apple.com/us/podcast/the-joe-rogan-experience/id1574007634",
  artworkUrl30: "https://example.com/artwork30.jpg",
  artworkUrl60: "https://example.com/artwork60.jpg",
  artworkUrl100: "https://example.com/artwork100.jpg",
  artworkUrl600: "https://example.com/artwork600.jpg",
  collectionPrice: 0,
  trackPrice: 0,
  collectionHdPrice: 0,
  releaseDate: "2024-01-15T10:00:00Z",
  collectionExplicitness: "notExplicit",
  trackExplicitness: "notExplicit",
  trackCount: 3,
  country: "USA",
  currency: "USD",
  primaryGenreName: "Comedy",
  contentAdvisoryRating: "Clean",
  genreIds: ["1303", "1304"],
  genres: ["Comedy", "Society & Culture"],
};

// Mock iTunes Episode Info
const mockiTunesEpisodeInfo1: iTunesEpisodeInfo = {
  artworkUrl160: "https://example.com/artwork160.jpg",
  artworkUrl600: "https://example.com/artwork600.jpg",
  artworkUrl60: "https://example.com/artwork60.jpg",
  episodeFileExtension: "mp3",
  episodeContentType: "audio",
  feedUrl: "https://feeds.example.com/jre.xml",
  closedCaptioning: "none",
  collectionId: 1574007634,
  collectionName: "The Joe Rogan Experience",
  artistIds: [284341002],
  genres: [
    { name: "Comedy", id: "1303" },
    { name: "Society & Culture", id: "1304" },
  ],
  episodeGuid: "jre-2057-elon-musk",
  trackName: "JRE #2057 - Elon Musk",
  trackId: 2057819234,
  shortDescription: "Elon Musk is a business magnate, investor, and engineer.",
  releaseDate: "2024-01-15T10:00:00Z",
  episodeUrl: "https://example.com/episode1.mp3",
  kind: "podcast-episode",
  wrapperType: "podcastEpisode",
  description: "Elon Musk is a business magnate, investor, and engineer.",
  country: "USA",
  collectionViewUrl:
    "https://podcasts.apple.com/us/podcast/the-joe-rogan-experience/id1574007634",
  trackViewUrl:
    "https://podcasts.apple.com/us/podcast/jre-2057-elon-musk/id2057819234",
  contentAdvisoryRating: "Clean",
  previewUrl: "https://example.com/episode1.mp3",
  trackTimeMillis: 10800000, // 3 hours in milliseconds
};

const mockiTunesEpisodeInfo2: iTunesEpisodeInfo = {
  artworkUrl160: "https://example.com/artwork160.jpg",
  artworkUrl600: "https://example.com/artwork600.jpg",
  artworkUrl60: "https://example.com/artwork60.jpg",
  episodeFileExtension: "mp3",
  episodeContentType: "audio",
  feedUrl: "https://feeds.example.com/jre.xml",
  closedCaptioning: "none",
  collectionId: 1574007634,
  collectionName: "The Joe Rogan Experience",
  artistIds: [284341002],
  genres: [
    { name: "Comedy", id: "1303" },
    { name: "Society & Culture", id: "1304" },
  ],
  episodeGuid: "jre-2056-duncan-trussell",
  trackName: "JRE #2056 - Duncan Trussell",
  trackId: 2056789123,
  shortDescription:
    "Duncan Trussell is a stand-up comic, writer, actor, host of the Duncan Trussell Family Hour podcast.",
  releaseDate: "2024-01-12T15:30:00Z",
  episodeUrl: "https://example.com/episode2.mp3",
  kind: "podcast-episode",
  wrapperType: "podcastEpisode",
  description:
    "Duncan Trussell is a stand-up comic, writer, actor, host of the Duncan Trussell Family Hour podcast.",
  country: "USA",
  collectionViewUrl:
    "https://podcasts.apple.com/us/podcast/the-joe-rogan-experience/id1574007634",
  trackViewUrl:
    "https://podcasts.apple.com/us/podcast/jre-2056-duncan-trussell/id2056789123",
  contentAdvisoryRating: "Clean",
  previewUrl: "https://example.com/episode2.mp3",
  trackTimeMillis: 7200000, // 2 hours in milliseconds
};

const mockiTunesEpisodeInfo3: iTunesEpisodeInfo = {
  artworkUrl160: "https://example.com/artwork160.jpg",
  artworkUrl600: "https://example.com/artwork600.jpg",
  artworkUrl60: "https://example.com/artwork60.jpg",
  episodeFileExtension: "mp3",
  episodeContentType: "audio",
  feedUrl: "https://feeds.example.com/jre.xml",
  closedCaptioning: "none",
  collectionId: 1574007634,
  collectionName: "The Joe Rogan Experience",
  artistIds: [284341002],
  genres: [
    { name: "Comedy", id: "1303" },
    { name: "Society & Culture", id: "1304" },
  ],
  episodeGuid: "jre-2055-tim-dillon",
  trackName: "JRE #2055 - Tim Dillon",
  trackId: 2055678912,
  shortDescription:
    "Tim Dillon is a stand-up comic, actor, and host of The Tim Dillon Show podcast.",
  releaseDate: "2024-01-10T12:00:00Z",
  episodeUrl: "https://example.com/episode3.mp3",
  kind: "podcast-episode",
  wrapperType: "podcastEpisode",
  description:
    "Tim Dillon is a stand-up comic, actor, and host of The Tim Dillon Show podcast.",
  country: "USA",
  collectionViewUrl:
    "https://podcasts.apple.com/us/podcast/the-joe-rogan-experience/id1574007634",
  trackViewUrl:
    "https://podcasts.apple.com/us/podcast/jre-2055-tim-dillon/id2055678912",
  contentAdvisoryRating: "Clean",
  previewUrl: "https://example.com/episode3.mp3",
  trackTimeMillis: 5400000, // 1.5 hours in milliseconds
};

// Mock iTunes Lookup Response for podcast detail
const mockiTunesLookupResponse: iTunesLookupResponse = {
  results: [
    mockiTunesPodcastInfo,
    mockiTunesEpisodeInfo1,
    mockiTunesEpisodeInfo2,
    mockiTunesEpisodeInfo3,
  ],
};

// Mock empty iTunes Lookup Response (podcast not found)
const mockEmptyiTunesLookupResponse: iTunesLookupResponse = {
  results: [],
};

// Mock iTunes Lookup Response with no episodes (only podcast info)
const mockiTunesLookupResponseNoEpisodes: iTunesLookupResponse = {
  results: [
    {
      ...mockiTunesPodcastInfo,
      collectionId: 1234567890,
      trackId: 1234567890,
      artistName: "New Podcaster",
      collectionName: "Brand New Podcast",
      trackName: "Brand New Podcast",
      trackCount: 0,
    },
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
  summary: "The Joe Rogan Experience",
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

// Mock iTunes Lookup Response with missing fields
const mockiTunesLookupResponseMissingFields: iTunesLookupResponse = {
  results: [
    {
      wrapperType: "track",
      kind: "podcast",
      collectionId: 999,
      trackId: 999,
      artistName: "",
      collectionName: "",
      trackName: "",
      collectionCensoredName: "",
      trackCensoredName: "",
      collectionViewUrl: "",
      feedUrl: "",
      trackViewUrl: "",
      artworkUrl30: "",
      artworkUrl60: "",
      artworkUrl100: "",
      artworkUrl600: "",
      collectionPrice: 0,
      trackPrice: 0,
      collectionHdPrice: 0,
      releaseDate: "",
      collectionExplicitness: "",
      trackExplicitness: "",
      trackCount: 1,
      country: "",
      currency: "",
      primaryGenreName: "",
      contentAdvisoryRating: "",
      genreIds: [],
      genres: [],
    },
    {
      artworkUrl160: "",
      artworkUrl600: "",
      artworkUrl60: "",
      episodeFileExtension: "mp3",
      episodeContentType: "audio",
      feedUrl: "",
      closedCaptioning: "",
      collectionId: 999,
      collectionName: "",
      artistIds: [],
      genres: [],
      episodeGuid: "",
      trackName: "",
      trackId: 1001,
      shortDescription: "",
      releaseDate: "",
      episodeUrl: "",
      kind: "podcast-episode",
      wrapperType: "podcastEpisode",
      description: "",
      country: "",
      collectionViewUrl: "",
      trackViewUrl: "",
      contentAdvisoryRating: "",
      previewUrl: "",
      trackTimeMillis: 0,
    },
  ],
};

export {
  mockiTunesApiResponse,
  mockiTunesLookupResponse,
  mockEmptyiTunesLookupResponse,
  mockiTunesLookupResponseNoEpisodes,
  mockiTunesLookupResponseMissingFields,
  mockiTunesPodcastInfo,
  mockiTunesEpisodeInfo1,
  mockiTunesEpisodeInfo2,
  mockiTunesEpisodeInfo3,
  mockiTunesEntry,
  expectedMappedPodcasts,
  expectedMappedPodcastDetail,
};

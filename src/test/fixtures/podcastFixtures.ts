import type { Episode } from "@/core/entities/Episode";
import type { Podcast } from "@/core/entities/Podcast";
import type { PodcastDetail } from "@/core/entities/PodcastDetail";

export const mockPodcasts: Podcast[] = [
  {
    id: "1",
    name: "Tech Talk",
    artist: "John Doe",
    summary: "A podcast about technology",
    image: "https://example.com/image1.jpg",
    trackCount: 2,
  },
  {
    id: "2",
    name: "Music Matters",
    artist: "Jane Smith",
    summary: "All about music industry",
    image: "https://example.com/image2.jpg",
    trackCount: 15,
  },
  {
    id: "3",
    name: "Tech News",
    artist: "Bob Wilson",
    summary: "Latest technology news",
    image: "https://example.com/image3.jpg",
    trackCount: 28,
  },
];

export const mockEpisodes: Episode[] = [
  {
    id: "ep1",
    title: "Getting Started with React",
    description: "Learn the basics of React development",
    audioUrl: "https://example.com/audio1.mp3",
    duration: 3600,
    releaseDate: "2024-01-15",
    podcastId: "1",
  },
  {
    id: "ep2",
    title: "Advanced TypeScript",
    description: "Deep dive into TypeScript features",
    audioUrl: "https://example.com/audio2.mp3",
    duration: 4200,
    releaseDate: "2024-01-20",
    podcastId: "1",
  },
];

export const mockPodcastDetail: PodcastDetail = {
  ...mockPodcasts[0],
  trackCount: mockEpisodes.length,
  episodes: mockEpisodes,
};

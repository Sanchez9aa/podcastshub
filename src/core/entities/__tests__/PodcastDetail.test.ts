import { describe, expect, it } from "vitest";
import {
  mockEpisodes,
  mockPodcastDetail,
} from "@/test/fixtures/podcastFixtures";
import type { Episode } from "../Episode";
import type { Podcast } from "../Podcast";
import type { PodcastDetail } from "../PodcastDetail";

describe("PodcastDetail", () => {
  describe("interface structure", () => {
    it("should extend Podcast interface", () => {
      const podcastDetail: PodcastDetail = {
        id: "123",
        name: "Tech Talk",
        artist: "John Doe",
        summary: "A podcast about technology",
        image: "https://example.com/image.jpg",
        episodes: [],
      };

      // Should have all Podcast properties
      expect(podcastDetail.id).toBe("123");
      expect(podcastDetail.name).toBe("Tech Talk");
      expect(podcastDetail.artist).toBe("John Doe");
      expect(podcastDetail.summary).toBe("A podcast about technology");
      expect(podcastDetail.image).toBe("https://example.com/image.jpg");

      // Should have episodes property
      expect(podcastDetail.episodes).toEqual([]);
    });

    it("should accept podcast with episodes", () => {
      const episodes: Episode[] = [
        {
          id: "ep1",
          title: "Episode 1",
          description: "First episode",
          releaseDate: "2024-01-01",
          duration: 1800,
          audioUrl: "https://example.com/ep1.mp3",
          podcastId: "123",
        },
        {
          id: "ep2",
          title: "Episode 2",
          description: "Second episode",
          releaseDate: "2024-01-02",
          duration: 2400,
          audioUrl: "https://example.com/ep2.mp3",
          podcastId: "123",
        },
      ];

      const podcastDetail: PodcastDetail = {
        id: "123",
        name: "Tech Talk",
        artist: "John Doe",
        summary: "A podcast about technology",
        image: "https://example.com/image.jpg",
        trackCount: 2,
        episodes,
      };

      expect(podcastDetail.episodes).toHaveLength(2);
      expect(podcastDetail.episodes[0].title).toBe("Episode 1");
      expect(podcastDetail.episodes[1].title).toBe("Episode 2");
      expect(podcastDetail.trackCount).toBe(2);
    });

    it("should accept podcast with optional trackCount", () => {
      const podcastWithTrackCount: PodcastDetail = {
        id: "456",
        name: "Music Matters",
        artist: "Jane Smith",
        summary: "All about music industry",
        image: "https://example.com/image2.jpg",
        trackCount: 15,
        episodes: [],
      };

      const podcastWithoutTrackCount: PodcastDetail = {
        id: "789",
        name: "News Daily",
        artist: "Bob Wilson",
        summary: "Daily news updates",
        image: "https://example.com/image3.jpg",
        episodes: [],
      };

      expect(podcastWithTrackCount.trackCount).toBe(15);
      expect(podcastWithoutTrackCount.trackCount).toBeUndefined();
    });

    it("should handle empty episodes array", () => {
      const podcastWithNoEpisodes: PodcastDetail = {
        id: "empty",
        name: "New Podcast",
        artist: "New Creator",
        summary: "A brand new podcast",
        image: "https://example.com/new.jpg",
        episodes: [],
      };

      expect(podcastWithNoEpisodes.episodes).toEqual([]);
      expect(podcastWithNoEpisodes.episodes).toHaveLength(0);
    });

    it("should handle large number of episodes", () => {
      const manyEpisodes: Episode[] = Array.from({ length: 100 }, (_, i) => ({
        id: `ep${i + 1}`,
        title: `Episode ${i + 1}`,
        description: `Description for episode ${i + 1}`,
        releaseDate: "2024-01-01",
        duration: 1800,
        audioUrl: `https://example.com/ep${i + 1}.mp3`,
        podcastId: "many-episodes",
      }));

      const podcastWithManyEpisodes: PodcastDetail = {
        id: "many-episodes",
        name: "Daily Podcast",
        artist: "Prolific Creator",
        summary: "A podcast with many episodes",
        image: "https://example.com/daily.jpg",
        trackCount: 100,
        episodes: manyEpisodes,
      };

      expect(podcastWithManyEpisodes.episodes).toHaveLength(100);
      expect(podcastWithManyEpisodes.episodes[0].title).toBe("Episode 1");
      expect(podcastWithManyEpisodes.episodes[99].title).toBe("Episode 100");
    });
  });

  describe("type checking", () => {
    it("should ensure episodes is an array", () => {
      const podcastDetail: PodcastDetail = {
        id: "test",
        name: "Test Podcast",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test.jpg",
        episodes: [
          {
            id: "ep1",
            title: "Test Episode",
            description: "Test Description",
            releaseDate: "2024-01-01",
            duration: 1800,
            audioUrl: "test.mp3",
            podcastId: "test",
          },
        ],
      };

      expect(Array.isArray(podcastDetail.episodes)).toBe(true);
      expect(podcastDetail.episodes).toHaveLength(1);
    });

    it("should ensure all episodes have correct structure", () => {
      const episode: Episode = {
        id: "test-ep",
        title: "Test Episode",
        description: "Test Description",
        releaseDate: "2024-01-01",
        duration: 1800,
        audioUrl: "test.mp3",
        podcastId: "test",
      };

      const podcastDetail: PodcastDetail = {
        id: "test",
        name: "Test Podcast",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test.jpg",
        episodes: [episode],
      };

      const firstEpisode = podcastDetail.episodes[0];
      expect(typeof firstEpisode.id).toBe("string");
      expect(typeof firstEpisode.title).toBe("string");
      expect(typeof firstEpisode.description).toBe("string");
      expect(typeof firstEpisode.releaseDate).toBe("string");
      expect(typeof firstEpisode.duration).toBe("number");
      expect(typeof firstEpisode.audioUrl).toBe("string");
      expect(typeof firstEpisode.podcastId).toBe("string");
    });
  });

  describe("common use cases", () => {
    it("should work with object destructuring", () => {
      const podcastDetail: PodcastDetail = {
        id: "destructure-test",
        name: "Destructure Test",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test.jpg",
        trackCount: 5,
        episodes: mockEpisodes,
      };

      const { episodes, trackCount, ...podcastInfo } = podcastDetail;

      expect(episodes).toHaveLength(2);
      expect(trackCount).toBe(5);
      expect(podcastInfo.id).toBe("destructure-test");
      expect(podcastInfo.name).toBe("Destructure Test");
    });

    it("should work with spread operator", () => {
      const basePodcast: Podcast = {
        id: "base",
        name: "Base Podcast",
        artist: "Base Artist",
        summary: "Base Summary",
        image: "base.jpg",
        trackCount: 10,
      };

      const podcastDetail: PodcastDetail = {
        ...basePodcast,
        episodes: mockEpisodes,
      };

      expect(podcastDetail.id).toBe("base");
      expect(podcastDetail.name).toBe("Base Podcast");
      expect(podcastDetail.episodes).toEqual(mockEpisodes);
    });

    it("should work with JSON serialization", () => {
      const podcastDetail: PodcastDetail = {
        id: "json-test",
        name: "JSON Test Podcast",
        artist: "JSON Artist",
        summary: "Testing JSON serialization",
        image: "json-test.jpg",
        trackCount: 2,
        episodes: mockEpisodes,
      };

      const jsonString = JSON.stringify(podcastDetail);
      const parsedDetail = JSON.parse(jsonString) as PodcastDetail;

      expect(parsedDetail.id).toBe(podcastDetail.id);
      expect(parsedDetail.episodes).toHaveLength(podcastDetail.episodes.length);
      expect(parsedDetail.episodes[0].title).toBe(mockEpisodes[0].title);
    });

    it("should work with Array methods on episodes", () => {
      const podcastDetail: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [
          ...mockEpisodes,
          {
            id: "ep3",
            title: "Third Episode",
            description: "Third episode description",
            releaseDate: "2024-01-25",
            duration: 5000,
            audioUrl: "https://example.com/audio3.mp3",
            podcastId: "1",
          },
        ],
      };

      // Filter episodes by duration
      const longEpisodes = podcastDetail.episodes.filter(
        (ep) => ep.duration > 4000,
      );
      expect(longEpisodes).toHaveLength(2);

      // Map episode titles
      const episodeTitles = podcastDetail.episodes.map((ep) => ep.title);
      expect(episodeTitles).toContain("Getting Started with React");
      expect(episodeTitles).toContain("Advanced TypeScript");
      expect(episodeTitles).toContain("Third Episode");

      // Find specific episode
      const foundEpisode = podcastDetail.episodes.find(
        (ep) => ep.title === "Advanced TypeScript",
      );
      expect(foundEpisode?.duration).toBe(4200);
    });

    it("should work with episode sorting", () => {
      const podcastDetail: PodcastDetail = {
        id: "sorting-test",
        name: "Sorting Test",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test.jpg",
        episodes: [
          {
            id: "ep3",
            title: "Latest Episode",
            description: "Most recent",
            releaseDate: "2024-03-01",
            duration: 1800,
            audioUrl: "https://example.com/3.mp3",
            podcastId: "sorting-test",
          },
          {
            id: "ep1",
            title: "First Episode",
            description: "Oldest",
            releaseDate: "2024-01-01",
            duration: 1800,
            audioUrl: "https://example.com/1.mp3",
            podcastId: "sorting-test",
          },
          {
            id: "ep2",
            title: "Middle Episode",
            description: "In between",
            releaseDate: "2024-02-01",
            duration: 1800,
            audioUrl: "https://example.com/2.mp3",
            podcastId: "sorting-test",
          },
        ],
      };

      // Sort episodes by release date
      const sortedEpisodes = [...podcastDetail.episodes].sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      );

      expect(sortedEpisodes[0].title).toBe("Latest Episode");
      expect(sortedEpisodes[1].title).toBe("Middle Episode");
      expect(sortedEpisodes[2].title).toBe("First Episode");
    });
  });

  describe("real-world scenarios", () => {
    it("should handle iTunes podcast detail structure", () => {
      const iTunesPodcastDetail: PodcastDetail = {
        id: "1234567890",
        name: "The Joe Rogan Experience",
        artist: "Joe Rogan",
        summary:
          "The Joe Rogan Experience podcast is a long form conversation hosted by comedian Joe Rogan.",
        image:
          "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/8b/b4/8f/8bb48f7c.jpg/600x600bb.jpg",
        trackCount: 20,
        episodes: [
          {
            id: "1000123456789",
            title: "JRE #2024 - Elon Musk",
            description:
              "Elon Musk is a business magnate, investor, and engineer.",
            releaseDate: "2024-01-15",
            duration: 10800,
            audioUrl:
              "https://chtbl.com/track/5899E/traffic.megaphone.fm/JRE1234567890.mp3",
            podcastId: "1234567890",
          },
          {
            id: "1000123456788",
            title: "JRE #2023 - Neil deGrasse Tyson",
            description: "Neil deGrasse Tyson is an American astrophysicist.",
            releaseDate: "2024-01-10",
            duration: 9600,
            audioUrl:
              "https://chtbl.com/track/5899E/traffic.megaphone.fm/JRE1234567889.mp3",
            podcastId: "1234567890",
          },
        ],
      };

      expect(iTunesPodcastDetail.id).toMatch(/^\d+$/);
      expect(iTunesPodcastDetail.episodes).toHaveLength(2);
      expect(iTunesPodcastDetail.episodes[0].audioUrl).toMatch(/^https:\/\//);
      expect(iTunesPodcastDetail.trackCount).toBe(20);
    });

    it("should handle podcast with mixed episode formats", () => {
      const podcastWithMixedEpisodes: PodcastDetail = {
        id: "mixed-format",
        name: "Mixed Format Podcast",
        artist: "Versatile Creator",
        summary: "A podcast with various episode formats",
        image: "https://example.com/mixed.jpg",
        episodes: [
          {
            id: "short-ep",
            title: "Quick Update",
            description: "A brief 5-minute update",
            releaseDate: "2024-01-01",
            duration: 300,
            audioUrl: "https://example.com/short.mp3",
            podcastId: "mixed-format",
          },
          {
            id: "interview-ep",
            title: "Interview with Expert",
            description: "In-depth interview",
            releaseDate: "2024-01-02",
            duration: 7200,
            audioUrl: "https://example.com/interview.mp3",
            podcastId: "mixed-format",
          },
          {
            id: "no-audio-ep",
            title: "Transcript Only",
            description: "Text-only episode",
            releaseDate: "2024-01-03",
            duration: 0,
            audioUrl: "",
            podcastId: "mixed-format",
          },
        ],
      };

      const hasAudioEpisodes = podcastWithMixedEpisodes.episodes.filter(
        (ep) => ep.audioUrl !== "",
      );
      const textOnlyEpisodes = podcastWithMixedEpisodes.episodes.filter(
        (ep) => ep.audioUrl === "",
      );

      expect(hasAudioEpisodes).toHaveLength(2);
      expect(textOnlyEpisodes).toHaveLength(1);
    });

    it("should handle podcast with HTML descriptions in episodes", () => {
      const podcastWithHtmlEpisodes: PodcastDetail = {
        id: "html-episodes",
        name: "Rich Content Podcast",
        artist: "Content Creator",
        summary: "Podcast with rich episode descriptions",
        image: "https://example.com/rich.jpg",
        episodes: [
          {
            id: "html-ep",
            title: "Episode with HTML",
            description:
              "<p>This episode covers <strong>important topics</strong>:</p><ul><li>React hooks</li><li>TypeScript</li></ul>",
            releaseDate: "2024-01-01",
            duration: 2700,
            audioUrl: "https://example.com/html.mp3",
            podcastId: "html-episodes",
          },
        ],
      };

      expect(podcastWithHtmlEpisodes.episodes[0].description).toContain("<p>");
      expect(podcastWithHtmlEpisodes.episodes[0].description).toContain(
        "<strong>",
      );
      expect(podcastWithHtmlEpisodes.episodes[0].description).toContain("<ul>");
    });

    it("should work with fixture data", () => {
      expect(mockPodcastDetail.id).toBe("1");
      expect(mockPodcastDetail.name).toBe("Tech Talk");
      expect(mockPodcastDetail.episodes).toHaveLength(2);
      expect(mockPodcastDetail.episodes[0].title).toBe(
        "Getting Started with React",
      );
      expect(mockPodcastDetail.episodes[1].title).toBe("Advanced TypeScript");
    });

    it("should handle podcast detail transformation from API", () => {
      // Simulate transforming API response to PodcastDetail
      const apiResponse = {
        collectionId: "987654321",
        collectionName: "Tech Weekly",
        artistName: "Tech Team",
        artworkUrl600: "https://example.com/artwork.jpg",
        trackCount: 50,
        episodes: [
          {
            trackId: "ep001",
            trackName: "Getting Started",
            description: "Introduction episode",
            releaseDate: "2024-01-01T10:00:00Z",
            trackTimeMillis: 1800000,
            previewUrl: "https://example.com/preview.mp3",
          },
        ],
      };

      const transformedDetail: PodcastDetail = {
        id: apiResponse.collectionId,
        name: apiResponse.collectionName,
        artist: apiResponse.artistName,
        summary: apiResponse.collectionName, // Using name as summary
        image: apiResponse.artworkUrl600,
        trackCount: apiResponse.trackCount,
        episodes: apiResponse.episodes.map((ep) => ({
          id: ep.trackId,
          title: ep.trackName,
          description: ep.description,
          releaseDate: ep.releaseDate.split("T")[0],
          duration: Math.floor(ep.trackTimeMillis / 1000),
          audioUrl: ep.previewUrl,
          podcastId: apiResponse.collectionId,
        })),
      };

      expect(transformedDetail.id).toBe("987654321");
      expect(transformedDetail.episodes[0].duration).toBe(1800);
      expect(transformedDetail.episodes[0].releaseDate).toBe("2024-01-01");
    });
  });

  describe("edge cases", () => {
    it("should handle trackCount mismatch with episodes length", () => {
      const podcastWithMismatch: PodcastDetail = {
        id: "mismatch",
        name: "Mismatch Podcast",
        artist: "Inconsistent Creator",
        summary: "Podcast with mismatched track count",
        image: "https://example.com/mismatch.jpg",
        trackCount: 100, // Says 100 but only has 2 episodes
        episodes: mockEpisodes.slice(0, 2),
      };

      expect(podcastWithMismatch.trackCount).toBe(100);
      expect(podcastWithMismatch.episodes).toHaveLength(2);
    });

    it("should handle episodes with same podcastId", () => {
      const podcastDetail: PodcastDetail = {
        id: "consistency-test",
        name: "Consistency Test",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test.jpg",
        episodes: [
          {
            id: "ep1",
            title: "Episode 1",
            description: "First episode",
            releaseDate: "2024-01-01",
            duration: 1800,
            audioUrl: "https://example.com/1.mp3",
            podcastId: "consistency-test",
          },
          {
            id: "ep2",
            title: "Episode 2",
            description: "Second episode",
            releaseDate: "2024-01-02",
            duration: 2400,
            audioUrl: "https://example.com/2.mp3",
            podcastId: "consistency-test",
          },
        ],
      };

      const allEpisodesMatchPodcast = podcastDetail.episodes.every(
        (ep) => ep.podcastId === podcastDetail.id,
      );

      expect(allEpisodesMatchPodcast).toBe(true);
    });

    it("should handle episodes with different podcastIds", () => {
      const podcastDetail: PodcastDetail = {
        id: "inconsistent-test",
        name: "Inconsistent Test",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test.jpg",
        episodes: [
          {
            id: "ep1",
            title: "Episode 1",
            description: "First episode",
            releaseDate: "2024-01-01",
            duration: 1800,
            audioUrl: "https://example.com/1.mp3",
            podcastId: "different-id",
          },
        ],
      };

      expect(podcastDetail.episodes[0].podcastId).not.toBe(podcastDetail.id);
    });
  });
});

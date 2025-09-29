import { describe, expect, it } from "vitest";
import type { Podcast } from "../Podcast";

describe("Podcast", () => {
  describe("interface structure", () => {
    it("should accept valid podcast data", () => {
      const validPodcast: Podcast = {
        id: "123",
        name: "Tech Talk",
        artist: "John Doe",
        summary: "A podcast about technology",
        image: "https://example.com/image.jpg",
      };

      expect(validPodcast.id).toBe("123");
      expect(validPodcast.name).toBe("Tech Talk");
      expect(validPodcast.artist).toBe("John Doe");
      expect(validPodcast.summary).toBe("A podcast about technology");
      expect(validPodcast.image).toBe("https://example.com/image.jpg");
    });

    it("should accept podcast with optional trackCount", () => {
      const podcastWithTrackCount: Podcast = {
        id: "456",
        name: "Music Matters",
        artist: "Jane Smith",
        summary: "All about music industry",
        image: "https://example.com/image2.jpg",
        trackCount: 15,
      };

      expect(podcastWithTrackCount.trackCount).toBe(15);
    });

    it("should accept podcast without trackCount", () => {
      const podcastWithoutTrackCount: Podcast = {
        id: "789",
        name: "News Daily",
        artist: "Bob Wilson",
        summary: "Daily news updates",
        image: "https://example.com/image3.jpg",
      };

      expect(podcastWithoutTrackCount.trackCount).toBeUndefined();
    });

    it("should handle empty strings for required fields", () => {
      const podcastWithEmptyStrings: Podcast = {
        id: "",
        name: "",
        artist: "",
        summary: "",
        image: "",
      };

      expect(podcastWithEmptyStrings.id).toBe("");
      expect(podcastWithEmptyStrings.name).toBe("");
      expect(podcastWithEmptyStrings.artist).toBe("");
      expect(podcastWithEmptyStrings.summary).toBe("");
      expect(podcastWithEmptyStrings.image).toBe("");
    });

    it("should handle long text content", () => {
      const longText = "A".repeat(1000);
      const podcastWithLongContent: Podcast = {
        id: `long-id-${"x".repeat(100)}`,
        name: `Long ${longText}`,
        artist: `Artist ${longText}`,
        summary: `Summary ${longText}`,
        image: `https://example.com/very-long-image-url-${longText}.jpg`,
      };

      expect(podcastWithLongContent.name).toContain("Long A");
      expect(podcastWithLongContent.artist).toContain("Artist A");
      expect(podcastWithLongContent.summary).toContain("Summary A");
      expect(podcastWithLongContent.image).toContain("very-long-image-url");
    });

    it("should handle special characters in fields", () => {
      const podcastWithSpecialChars: Podcast = {
        id: "special-123-@#$",
        name: "Tech & Science: The Future! 🚀",
        artist: "Dr. María José García-López",
        summary:
          "Exploring tech & science with experts. Join us for insights on AI, quantum computing, and more! #TechTalk",
        image:
          "https://example.com/images/tech-science_podcast.jpg?v=1.2&size=600x600",
      };

      expect(podcastWithSpecialChars.name).toContain("🚀");
      expect(podcastWithSpecialChars.artist).toContain(
        "María José García-López",
      );
      expect(podcastWithSpecialChars.summary).toContain("#TechTalk");
      expect(podcastWithSpecialChars.image).toContain("?v=1.2&size=600x600");
    });

    it("should handle trackCount edge cases", () => {
      const podcastWithZeroTracks: Podcast = {
        id: "zero-tracks",
        name: "Empty Podcast",
        artist: "Silent Artist",
        summary: "A podcast with no episodes yet",
        image: "https://example.com/empty.jpg",
        trackCount: 0,
      };

      const podcastWithManyTracks: Podcast = {
        id: "many-tracks",
        name: "Daily Podcast",
        artist: "Prolific Creator",
        summary: "A podcast with many episodes",
        image: "https://example.com/daily.jpg",
        trackCount: 9999,
      };

      expect(podcastWithZeroTracks.trackCount).toBe(0);
      expect(podcastWithManyTracks.trackCount).toBe(9999);
    });
  });

  describe("type checking", () => {
    it("should ensure all required fields are strings", () => {
      const podcast: Podcast = {
        id: "test-id",
        name: "Test Name",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test-image.jpg",
      };

      expect(typeof podcast.id).toBe("string");
      expect(typeof podcast.name).toBe("string");
      expect(typeof podcast.artist).toBe("string");
      expect(typeof podcast.summary).toBe("string");
      expect(typeof podcast.image).toBe("string");
    });

    it("should ensure trackCount is optional number", () => {
      const podcastWithTrackCount: Podcast = {
        id: "test",
        name: "Test",
        artist: "Test",
        summary: "Test",
        image: "test.jpg",
        trackCount: 42,
      };

      const podcastWithoutTrackCount: Podcast = {
        id: "test",
        name: "Test",
        artist: "Test",
        summary: "Test",
        image: "test.jpg",
      };

      expect(typeof podcastWithTrackCount.trackCount).toBe("number");
      expect(podcastWithoutTrackCount.trackCount).toBeUndefined();
    });
  });

  describe("common use cases", () => {
    it("should work with Array methods", () => {
      const podcasts: Podcast[] = [
        {
          id: "1",
          name: "Podcast A",
          artist: "Artist A",
          summary: "Summary A",
          image: "image-a.jpg",
          trackCount: 10,
        },
        {
          id: "2",
          name: "Podcast B",
          artist: "Artist B",
          summary: "Summary B",
          image: "image-b.jpg",
          trackCount: 5,
        },
        {
          id: "3",
          name: "Podcast C",
          artist: "Artist C",
          summary: "Summary C",
          image: "image-c.jpg",
        },
      ];

      const podcastIds = podcasts.map((p) => p.id);
      expect(podcastIds).toEqual(["1", "2", "3"]);

      const podcastWithTracks = podcasts.filter(
        (p) => p.trackCount !== undefined,
      );
      expect(podcastWithTracks).toHaveLength(2);

      const foundPodcast = podcasts.find((p) => p.name === "Podcast B");
      expect(foundPodcast?.artist).toBe("Artist B");
    });

    it("should work with object destructuring", () => {
      const podcast: Podcast = {
        id: "destructure-test",
        name: "Destructure Test",
        artist: "Test Artist",
        summary: "Test Summary",
        image: "test.jpg",
        trackCount: 20,
      };

      const { id, name, artist, ...rest } = podcast;

      expect(id).toBe("destructure-test");
      expect(name).toBe("Destructure Test");
      expect(artist).toBe("Test Artist");
      expect(rest.summary).toBe("Test Summary");
      expect(rest.image).toBe("test.jpg");
      expect(rest.trackCount).toBe(20);
    });

    it("should work with spread operator", () => {
      const basePodcast: Podcast = {
        id: "base",
        name: "Base Podcast",
        artist: "Base Artist",
        summary: "Base Summary",
        image: "base.jpg",
      };

      const extendedPodcast: Podcast = {
        ...basePodcast,
        name: "Extended Podcast",
        trackCount: 15,
      };

      expect(extendedPodcast.id).toBe("base");
      expect(extendedPodcast.name).toBe("Extended Podcast");
      expect(extendedPodcast.artist).toBe("Base Artist");
      expect(extendedPodcast.trackCount).toBe(15);
    });

    it("should work with JSON serialization", () => {
      const podcast: Podcast = {
        id: "json-test",
        name: "JSON Test Podcast",
        artist: "JSON Artist",
        summary: "Testing JSON serialization",
        image: "json-test.jpg",
        trackCount: 30,
      };

      const jsonString = JSON.stringify(podcast);
      const parsedPodcast = JSON.parse(jsonString) as Podcast;

      expect(parsedPodcast.id).toBe(podcast.id);
      expect(parsedPodcast.name).toBe(podcast.name);
      expect(parsedPodcast.artist).toBe(podcast.artist);
      expect(parsedPodcast.summary).toBe(podcast.summary);
      expect(parsedPodcast.image).toBe(podcast.image);
      expect(parsedPodcast.trackCount).toBe(podcast.trackCount);
    });
  });

  describe("real-world scenarios", () => {
    it("should handle iTunes podcast data structure", () => {
      const iTunesPodcast: Podcast = {
        id: "1234567890",
        name: "The Joe Rogan Experience",
        artist: "Joe Rogan",
        summary:
          "The Joe Rogan Experience podcast is a long form conversation hosted by comedian Joe Rogan with friends and guests that have included comedians, actors, musicians, MMA fighters, authors, artists, and beyond.",
        image:
          "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/8b/b4/8f/8bb48f7c-84f7-e99f-6c09-dd85a51c2a9c/mza_2449308932.jpg/600x600bb.jpg",
        trackCount: 2156,
      };

      expect(iTunesPodcast.id).toMatch(/^\d+$/);
      expect(iTunesPodcast.image).toMatch(/^https:\/\//);
      expect(iTunesPodcast.trackCount).toBeGreaterThan(0);
    });

    it("should handle podcast without episodes", () => {
      const newPodcast: Podcast = {
        id: "new-podcast-123",
        name: "Brand New Podcast",
        artist: "Emerging Creator",
        summary: "A brand new podcast that hasn't published any episodes yet",
        image: "https://example.com/new-podcast-artwork.jpg",
        trackCount: 0,
      };

      expect(newPodcast.trackCount).toBe(0);
      expect(newPodcast.summary).toContain("new podcast");
    });

    it("should handle podcast with missing optional data", () => {
      const minimalPodcast: Podcast = {
        id: "minimal-123",
        name: "Minimal Podcast",
        artist: "Unknown Artist",
        summary: "No additional information available",
        image: "placeholder.jpg",
      };

      expect(minimalPodcast.trackCount).toBeUndefined();
      expect(minimalPodcast).toHaveProperty("id");
      expect(minimalPodcast).toHaveProperty("name");
      expect(minimalPodcast).toHaveProperty("artist");
      expect(minimalPodcast).toHaveProperty("summary");
      expect(minimalPodcast).toHaveProperty("image");
    });
  });
});

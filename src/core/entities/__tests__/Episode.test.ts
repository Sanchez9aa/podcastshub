import { describe, expect, it } from "vitest";
import type { Episode } from "../Episode";

describe("Episode", () => {
  describe("interface structure", () => {
    it("should accept valid episode data", () => {
      const validEpisode: Episode = {
        id: "ep123",
        title: "Getting Started with React",
        description: "Learn the basics of React development",
        releaseDate: "2024-01-15",
        duration: 3600,
        audioUrl: "https://example.com/audio.mp3",
        podcastId: "podcast123",
      };

      expect(validEpisode.id).toBe("ep123");
      expect(validEpisode.title).toBe("Getting Started with React");
      expect(validEpisode.description).toBe(
        "Learn the basics of React development",
      );
      expect(validEpisode.releaseDate).toBe("2024-01-15");
      expect(validEpisode.duration).toBe(3600);
      expect(validEpisode.audioUrl).toBe("https://example.com/audio.mp3");
      expect(validEpisode.podcastId).toBe("podcast123");
    });

    it("should handle empty strings for required fields", () => {
      const episodeWithEmptyStrings: Episode = {
        id: "",
        title: "",
        description: "",
        releaseDate: "",
        duration: 0,
        audioUrl: "",
        podcastId: "",
      };

      expect(episodeWithEmptyStrings.id).toBe("");
      expect(episodeWithEmptyStrings.title).toBe("");
      expect(episodeWithEmptyStrings.description).toBe("");
      expect(episodeWithEmptyStrings.releaseDate).toBe("");
      expect(episodeWithEmptyStrings.duration).toBe(0);
      expect(episodeWithEmptyStrings.audioUrl).toBe("");
      expect(episodeWithEmptyStrings.podcastId).toBe("");
    });

    it("should handle long text content", () => {
      const longText = "A".repeat(1000);
      const episodeWithLongContent: Episode = {
        id: `long-id-${"x".repeat(50)}`,
        title: `Long ${longText}`,
        description: `Description ${longText}`,
        releaseDate: "2024-12-31",
        duration: 999999,
        audioUrl: `https://example.com/very-long-audio-url-"${longText}".mp3"`,
        podcastId: `long-podcast-id-${"y".repeat(50)}`,
      };

      expect(episodeWithLongContent.title).toContain("Long A");
      expect(episodeWithLongContent.description).toContain("Description A");
      expect(episodeWithLongContent.audioUrl).toContain("very-long-audio-url");
    });

    it("should handle special characters in fields", () => {
      const episodeWithSpecialChars: Episode = {
        id: "special-ep-123-@#$",
        title: "Tech & Science: Episode #42! 🎧",
        description:
          "Join us for an exciting discussion about AI & machine learning. Visit our website: https://example.com & follow @techpodcast",
        releaseDate: "2024-03-15",
        duration: 2700,
        audioUrl:
          "https://cdn.example.com/episodes/tech-science_ep42.mp3?token=abc123&quality=high",
        podcastId: "tech-science-podcast_2024",
      };

      expect(episodeWithSpecialChars.title).toContain("🎧");
      expect(episodeWithSpecialChars.description).toContain("@techpodcast");
      expect(episodeWithSpecialChars.audioUrl).toContain(
        "?token=abc123&quality=high",
      );
    });

    it("should handle different duration values", () => {
      const shortEpisode: Episode = {
        id: "short",
        title: "Quick Update",
        description: "A brief update",
        releaseDate: "2024-01-01",
        duration: 30,
        audioUrl: "https://example.com/short.mp3",
        podcastId: "updates",
      };

      const longEpisode: Episode = {
        id: "long",
        title: "Deep Dive Discussion",
        description: "An in-depth conversation",
        releaseDate: "2024-01-02",
        duration: 14400, // 4 hours
        audioUrl: "https://example.com/long.mp3",
        podcastId: "discussions",
      };

      expect(shortEpisode.duration).toBe(30);
      expect(longEpisode.duration).toBe(14400);
    });

    it("should handle various date formats in releaseDate", () => {
      const episodes: Episode[] = [
        {
          id: "date1",
          title: "Episode 1",
          description: "Description 1",
          releaseDate: "2024-01-01",
          duration: 1800,
          audioUrl: "https://example.com/1.mp3",
          podcastId: "test",
        },
        {
          id: "date2",
          title: "Episode 2",
          description: "Description 2",
          releaseDate: "2024-12-31",
          duration: 1800,
          audioUrl: "https://example.com/2.mp3",
          podcastId: "test",
        },
        {
          id: "date3",
          title: "Episode 3",
          description: "Description 3",
          releaseDate: "2023-06-15",
          duration: 1800,
          audioUrl: "https://example.com/3.mp3",
          podcastId: "test",
        },
      ];

      expect(episodes[0].releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(episodes[1].releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(episodes[2].releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("type checking", () => {
    it("should ensure all string fields are strings", () => {
      const episode: Episode = {
        id: "test-id",
        title: "Test Title",
        description: "Test Description",
        releaseDate: "2024-01-01",
        duration: 1800,
        audioUrl: "test-audio.mp3",
        podcastId: "test-podcast",
      };

      expect(typeof episode.id).toBe("string");
      expect(typeof episode.title).toBe("string");
      expect(typeof episode.description).toBe("string");
      expect(typeof episode.releaseDate).toBe("string");
      expect(typeof episode.audioUrl).toBe("string");
      expect(typeof episode.podcastId).toBe("string");
    });

    it("should ensure duration is a number", () => {
      const episode: Episode = {
        id: "test",
        title: "Test",
        description: "Test",
        releaseDate: "2024-01-01",
        duration: 42,
        audioUrl: "test.mp3",
        podcastId: "test",
      };

      expect(typeof episode.duration).toBe("number");
      expect(Number.isInteger(episode.duration)).toBe(true);
    });
  });

  describe("common use cases", () => {
    it("should work with Array methods", () => {
      const episodes: Episode[] = [
        {
          id: "1",
          title: "Episode 1",
          description: "First episode",
          releaseDate: "2024-01-01",
          duration: 1800,
          audioUrl: "https://example.com/1.mp3",
          podcastId: "podcast1",
        },
        {
          id: "2",
          title: "Episode 2",
          description: "Second episode",
          releaseDate: "2024-01-02",
          duration: 2400,
          audioUrl: "https://example.com/2.mp3",
          podcastId: "podcast1",
        },
        {
          id: "3",
          title: "Episode 3",
          description: "Third episode",
          releaseDate: "2024-01-03",
          duration: 3000,
          audioUrl: "https://example.com/3.mp3",
          podcastId: "podcast2",
        },
      ];

      const episodeIds = episodes.map((e) => e.id);
      expect(episodeIds).toEqual(["1", "2", "3"]);

      const longEpisodes = episodes.filter((e) => e.duration > 2000);
      expect(longEpisodes).toHaveLength(2);

      const podcast1Episodes = episodes.filter(
        (e) => e.podcastId === "podcast1",
      );
      expect(podcast1Episodes).toHaveLength(2);

      const foundEpisode = episodes.find((e) => e.title === "Episode 2");
      expect(foundEpisode?.description).toBe("Second episode");
    });

    it("should work with object destructuring", () => {
      const episode: Episode = {
        id: "destructure-test",
        title: "Destructure Test Episode",
        description: "Testing destructuring",
        releaseDate: "2024-01-01",
        duration: 1800,
        audioUrl: "https://example.com/test.mp3",
        podcastId: "test-podcast",
      };

      const { id, title, duration, ...rest } = episode;

      expect(id).toBe("destructure-test");
      expect(title).toBe("Destructure Test Episode");
      expect(duration).toBe(1800);
      expect(rest.description).toBe("Testing destructuring");
      expect(rest.audioUrl).toBe("https://example.com/test.mp3");
      expect(rest.podcastId).toBe("test-podcast");
    });

    it("should work with spread operator", () => {
      const baseEpisode: Episode = {
        id: "base",
        title: "Base Episode",
        description: "Base Description",
        releaseDate: "2024-01-01",
        duration: 1800,
        audioUrl: "https://example.com/base.mp3",
        podcastId: "base-podcast",
      };

      const extendedEpisode: Episode = {
        ...baseEpisode,
        title: "Extended Episode",
        duration: 2400,
      };

      expect(extendedEpisode.id).toBe("base");
      expect(extendedEpisode.title).toBe("Extended Episode");
      expect(extendedEpisode.description).toBe("Base Description");
      expect(extendedEpisode.duration).toBe(2400);
      expect(extendedEpisode.audioUrl).toBe("https://example.com/base.mp3");
    });

    it("should work with JSON serialization", () => {
      const episode: Episode = {
        id: "json-test",
        title: "JSON Test Episode",
        description: "Testing JSON serialization",
        releaseDate: "2024-01-01",
        duration: 1800,
        audioUrl: "https://example.com/json-test.mp3",
        podcastId: "json-podcast",
      };

      const jsonString = JSON.stringify(episode);
      const parsedEpisode = JSON.parse(jsonString) as Episode;

      expect(parsedEpisode.id).toBe(episode.id);
      expect(parsedEpisode.title).toBe(episode.title);
      expect(parsedEpisode.description).toBe(episode.description);
      expect(parsedEpisode.releaseDate).toBe(episode.releaseDate);
      expect(parsedEpisode.duration).toBe(episode.duration);
      expect(parsedEpisode.audioUrl).toBe(episode.audioUrl);
      expect(parsedEpisode.podcastId).toBe(episode.podcastId);
    });

    it("should work with sorting by date", () => {
      const episodes: Episode[] = [
        {
          id: "3",
          title: "Latest Episode",
          description: "Most recent",
          releaseDate: "2024-03-01",
          duration: 1800,
          audioUrl: "https://example.com/3.mp3",
          podcastId: "podcast1",
        },
        {
          id: "1",
          title: "First Episode",
          description: "Oldest",
          releaseDate: "2024-01-01",
          duration: 1800,
          audioUrl: "https://example.com/1.mp3",
          podcastId: "podcast1",
        },
        {
          id: "2",
          title: "Middle Episode",
          description: "In between",
          releaseDate: "2024-02-01",
          duration: 1800,
          audioUrl: "https://example.com/2.mp3",
          podcastId: "podcast1",
        },
      ];

      const sortedByDate = episodes.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );

      expect(sortedByDate[0].id).toBe("1");
      expect(sortedByDate[1].id).toBe("2");
      expect(sortedByDate[2].id).toBe("3");
    });
  });

  describe("real-world scenarios", () => {
    it("should handle iTunes episode data structure", () => {
      const iTunesEpisode: Episode = {
        id: "1000123456789",
        title: "JRE #2024 - Elon Musk",
        description:
          "Elon Musk is a business magnate, investor, and engineer. He is the founder, CEO, and Chief Engineer at SpaceX; CEO and product architect of Tesla, Inc.; founder of The Boring Company; and co-founder of Neuralink and OpenAI.",
        releaseDate: "2024-01-15",
        duration: 10800, // 3 hours
        audioUrl:
          "https://chtbl.com/track/5899E/traffic.megaphone.fm/JRE1234567890.mp3",
        podcastId: "360084272",
      };

      expect(iTunesEpisode.id).toMatch(/^\d+$/);
      expect(iTunesEpisode.audioUrl).toMatch(/^https:\/\//);
      expect(iTunesEpisode.duration).toBeGreaterThan(0);
      expect(iTunesEpisode.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle episode without audio", () => {
      const episodeWithoutAudio: Episode = {
        id: "no-audio-123",
        title: "Transcript Only Episode",
        description: "This episode is available as text only",
        releaseDate: "2024-01-01",
        duration: 0,
        audioUrl: "",
        podcastId: "text-podcast",
      };

      expect(episodeWithoutAudio.audioUrl).toBe("");
      expect(episodeWithoutAudio.duration).toBe(0);
    });

    it("should handle HTML content in description", () => {
      const episodeWithHtml: Episode = {
        id: "html-episode",
        title: "Episode with HTML Description",
        description:
          "<p>This episode covers <strong>important topics</strong> including:</p><ul><li>React hooks</li><li>TypeScript</li></ul><p>Visit our website at <a href='https://example.com'>example.com</a></p>",
        releaseDate: "2024-01-01",
        duration: 2700,
        audioUrl: "https://example.com/html-episode.mp3",
        podcastId: "tech-podcast",
      };

      expect(episodeWithHtml.description).toContain("<p>");
      expect(episodeWithHtml.description).toContain("<strong>");
      expect(episodeWithHtml.description).toContain("<ul>");
      expect(episodeWithHtml.description).toContain("<a href=");
    });

    it("should handle various audio formats", () => {
      const episodes: Episode[] = [
        {
          id: "mp3-episode",
          title: "MP3 Episode",
          description: "Episode in MP3 format",
          releaseDate: "2024-01-01",
          duration: 1800,
          audioUrl: "https://example.com/episode.mp3",
          podcastId: "podcast1",
        },
        {
          id: "m4a-episode",
          title: "M4A Episode",
          description: "Episode in M4A format",
          releaseDate: "2024-01-02",
          duration: 1800,
          audioUrl: "https://example.com/episode.m4a",
          podcastId: "podcast1",
        },
        {
          id: "wav-episode",
          title: "WAV Episode",
          description: "Episode in WAV format",
          releaseDate: "2024-01-03",
          duration: 1800,
          audioUrl: "https://example.com/episode.wav",
          podcastId: "podcast1",
        },
      ];

      expect(episodes[0].audioUrl).toMatch(/\.mp3$/);
      expect(episodes[1].audioUrl).toMatch(/\.m4a$/);
      expect(episodes[2].audioUrl).toMatch(/\.wav$/);
    });

    it("should handle duration conversion scenarios", () => {
      const episodeFromMinutes: Episode = {
        id: "duration-test",
        title: "Duration Test",
        description: "Testing duration handling",
        releaseDate: "2024-01-01",
        duration: 30 * 60, // 30 minutes in seconds
        audioUrl: "https://example.com/test.mp3",
        podcastId: "test",
      };

      const episodeFromHours: Episode = {
        id: "duration-test-2",
        title: "Duration Test 2",
        description: "Testing long duration",
        releaseDate: "2024-01-01",
        duration: 2.5 * 60 * 60, // 2.5 hours in seconds
        audioUrl: "https://example.com/test2.mp3",
        podcastId: "test",
      };

      expect(episodeFromMinutes.duration).toBe(1800);
      expect(episodeFromHours.duration).toBe(9000);
    });
  });

  describe("edge cases", () => {
    it("should handle negative duration", () => {
      const episodeWithNegativeDuration: Episode = {
        id: "negative-duration",
        title: "Invalid Duration Episode",
        description: "Episode with invalid duration",
        releaseDate: "2024-01-01",
        duration: -100,
        audioUrl: "https://example.com/test.mp3",
        podcastId: "test",
      };

      expect(episodeWithNegativeDuration.duration).toBe(-100);
    });

    it("should handle very large duration", () => {
      const episodeWithLargeDuration: Episode = {
        id: "large-duration",
        title: "Very Long Episode",
        description: "Episode with very long duration",
        releaseDate: "2024-01-01",
        duration: Number.MAX_SAFE_INTEGER,
        audioUrl: "https://example.com/test.mp3",
        podcastId: "test",
      };

      expect(episodeWithLargeDuration.duration).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("should handle invalid date format in releaseDate", () => {
      const episodeWithInvalidDate: Episode = {
        id: "invalid-date",
        title: "Invalid Date Episode",
        description: "Episode with invalid date format",
        releaseDate: "not-a-date",
        duration: 1800,
        audioUrl: "https://example.com/test.mp3",
        podcastId: "test",
      };

      expect(episodeWithInvalidDate.releaseDate).toBe("not-a-date");
    });
  });
});

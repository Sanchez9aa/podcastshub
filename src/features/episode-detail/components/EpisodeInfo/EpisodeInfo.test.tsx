import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EpisodeInfo } from "@/features/episode-detail/components/EpisodeInfo/EpisodeInfo";
import {
  mockEpisodeNoAudio,
  mockEpisodeWithAudio,
} from "@/test/fixtures/podcastFixtures";

const mockUseAudioMetadata = vi.fn();
vi.mock("@/features/episode-detail/hooks/useAudioMetadata", () => ({
  useAudioMetadata: () => mockUseAudioMetadata(),
}));

vi.mock("@/shared/utils/sanitizeHtml", () => ({
  sanitizeHtml: vi.fn((html: string) => `Sanitized: ${html}`),
}));

describe("EpisodeInfo", () => {
  beforeEach(() => {
    mockUseAudioMetadata.mockReturnValue({
      hasError: false,
      onError: vi.fn(),
    });
  });

  it("should render episode title", () => {
    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Test Episode Title");
    expect(title).toHaveAttribute("id", "episode-title");
  });

  it("should render sanitized description", () => {
    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    // Check that the sanitized HTML is rendered - using partial text matching
    expect(screen.getByText(/This is a/)).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(
      screen.getByText(/episode description with HTML/),
    ).toBeInTheDocument();
  });

  it("should render audio player when audioUrl is available", () => {
    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    const audioPlayer = document.querySelector("audio");
    expect(audioPlayer).toBeInTheDocument();
    expect(audioPlayer).toHaveAttribute("controls");
    expect(audioPlayer).toHaveAttribute("preload", "none");
    expect(audioPlayer).toHaveAttribute(
      "aria-label",
      "Audio player for episode: Test Episode Title",
    );
    expect(audioPlayer).toHaveAttribute(
      "aria-describedby",
      "audio-description",
    );
  });

  it("should render multiple audio source formats", () => {
    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    const sources = document.querySelectorAll("source");

    expect(sources).toHaveLength(3);
    expect(sources[0]).toHaveAttribute("src", "https://example.com/audio.mp3");
    expect(sources[0]).toHaveAttribute("type", "audio/mpeg");
    expect(sources[1]).toHaveAttribute("type", "audio/mp4");
    expect(sources[2]).toHaveAttribute("type", "audio/mp3");
  });

  it("should render audio instructions for accessibility", () => {
    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    const instructions = screen.getByText(
      "Use space bar to play or pause, arrow keys to seek, M to mute",
    );
    expect(instructions).toBeInTheDocument();
    expect(instructions.closest("div")).toHaveAttribute(
      "id",
      "audio-description",
    );
  });

  it("should show no audio message when audioUrl is not available", () => {
    render(<EpisodeInfo episode={mockEpisodeNoAudio} />);

    expect(
      screen.getByText("Audio not available for this episode"),
    ).toBeInTheDocument();
    expect(document.querySelector("audio")).not.toBeInTheDocument();
  });

  it("should handle audio error state", () => {
    mockUseAudioMetadata.mockReturnValue({
      hasError: true,
      onError: vi.fn(),
    });

    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(
      "Failed to load audio. Please try refreshing the page.",
    );
  });

  it("should call onError when audio fails to load", () => {
    const mockOnError = vi.fn();
    mockUseAudioMetadata.mockReturnValue({
      hasError: false,
      onError: mockOnError,
    });

    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    const audioPlayer = document.querySelector("audio");
    expect(audioPlayer).toBeInTheDocument();
    fireEvent.error(audioPlayer as HTMLAudioElement);

    expect(mockOnError).toHaveBeenCalled();
  });

  it("should not show error message when hasError is false", () => {
    mockUseAudioMetadata.mockReturnValue({
      hasError: false,
      onError: vi.fn(),
    });

    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Failed to load audio. Please try refreshing the page.",
      ),
    ).not.toBeInTheDocument();
  });

  it("should render fallback text for unsupported browsers", () => {
    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    expect(
      screen.getByText("Your browser does not support the audio element."),
    ).toBeInTheDocument();
  });

  it("should handle empty description", () => {
    const episodeEmptyDescription = {
      ...mockEpisodeWithAudio,
      description: "",
    };

    render(<EpisodeInfo episode={episodeEmptyDescription} />);

    // With empty description, the sanitizer should return empty content
    const descriptionDiv = document.querySelector('[class*="description"]');
    expect(descriptionDiv).toBeInTheDocument();
  });

  it("should render with both audio player and error state", () => {
    mockUseAudioMetadata.mockReturnValue({
      hasError: true,
      onError: vi.fn(),
    });

    render(<EpisodeInfo episode={mockEpisodeWithAudio} />);

    expect(document.querySelector("audio")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

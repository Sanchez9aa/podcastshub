import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { EpisodeList } from "@/features/podcast-detail/components/EpisodeList/EpisodeList";
import { mockEpisodes } from "@/test/fixtures/podcastFixtures";

vi.mock("@/shared/utils/formatDate", () => ({
  formatDate: vi.fn((date: string) => `Formatted: ${date}`),
}));

vi.mock("@/shared/utils/formatDuration", () => ({
  formatDuration: vi.fn(
    (duration: number) =>
      `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`,
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("EpisodeList", () => {
  it("should render episode count header", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    expect(screen.getByText("Episodes: 2")).toBeInTheDocument();
  });

  it("should render table with correct headers", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Date" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Duration" }),
    ).toBeInTheDocument();
  });

  it("should render accessible table caption", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    expect(
      screen.getByText(
        "List of 2 podcast episodes with title, release date, and duration",
      ),
    ).toBeInTheDocument();
  });

  it("should render all episodes with correct data", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    expect(screen.getByText("Getting Started with React")).toBeInTheDocument();
    expect(screen.getByText("Advanced TypeScript")).toBeInTheDocument();

    expect(screen.getByText("Formatted: 2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("Formatted: 2024-01-20")).toBeInTheDocument();
  });

  it("should format duration correctly", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    expect(screen.getByText("60:00")).toBeInTheDocument(); // 3600 seconds
    expect(screen.getByText("70:00")).toBeInTheDocument(); // 4200 seconds
  });

  it("should create correct episode links", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    const episode1Link = screen.getByRole("link", {
      name: "Getting Started with React",
    });
    const episode2Link = screen.getByRole("link", {
      name: "Advanced TypeScript",
    });

    expect(episode1Link).toHaveAttribute(
      "href",
      "/podcast/podcast-123/episode/ep1",
    );
    expect(episode2Link).toHaveAttribute(
      "href",
      "/podcast/podcast-123/episode/ep2",
    );
  });

  it("should have accessible time elements", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    const timeElements = screen.getAllByRole("time");
    expect(timeElements).toHaveLength(2);

    expect(timeElements[0]).toHaveAttribute("dateTime", "2024-01-15");
    expect(timeElements[1]).toHaveAttribute("dateTime", "2024-01-20");
  });

  it("should have accessible aria-describedby on episode links", () => {
    renderWithRouter(
      <EpisodeList episodes={mockEpisodes} podcastId="podcast-123" />,
    );

    const episode1Link = screen.getByRole("link", {
      name: "Getting Started with React",
    });
    expect(episode1Link).toHaveAttribute(
      "aria-describedby",
      "episode-ep1-date episode-ep1-duration",
    );

    const episode2Link = screen.getByRole("link", {
      name: "Advanced TypeScript",
    });
    expect(episode2Link).toHaveAttribute(
      "aria-describedby",
      "episode-ep2-date episode-ep2-duration",
    );
  });

  it("should render empty list correctly", () => {
    renderWithRouter(<EpisodeList episodes={[]} podcastId="podcast-123" />);

    expect(screen.getByText("Episodes: 0")).toBeInTheDocument();
    expect(
      screen.getByText(
        "List of 0 podcast episodes with title, release date, and duration",
      ),
    ).toBeInTheDocument();
  });

  it("should handle single episode correctly", () => {
    const singleEpisode = [mockEpisodes[0]];

    renderWithRouter(
      <EpisodeList episodes={singleEpisode} podcastId="podcast-123" />,
    );

    expect(screen.getByText("Episodes: 1")).toBeInTheDocument();
    expect(screen.getByText("Getting Started with React")).toBeInTheDocument();
    expect(screen.queryByText("Advanced TypeScript")).not.toBeInTheDocument();
  });
});

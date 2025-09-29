import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Episode } from "@/core/entities/Episode";
import type { Podcast } from "@/core/entities/Podcast";
import {
  mockEpisodes,
  mockPodcastDetail,
} from "@/test/fixtures/podcastFixtures";
import { createQueryWithUIWrapper } from "@/test/utils/testWrappers";
import { EpisodeDetailPage } from "./EpisodeDetailPage";

const mockUseParams = vi.fn();
const mockUsePodcastDetail = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

vi.mock("@/infrastructure/query/podcastQueries", () => ({
  usePodcastDetail: (id: string) => mockUsePodcastDetail(id),
}));

vi.mock(
  "@/features/episode-detail/components/EpisodeDetailSkeleton/EpisodeDetailSkeleton",
  () => ({
    EpisodeDetailSkeleton: () => (
      <div data-testid="episode-detail-skeleton">Loading episode...</div>
    ),
  }),
);

vi.mock("@/shared/components/PodcastInfo/PodcastInfo", () => ({
  PodcastInfo: ({
    podcast,
    podcastId,
  }: {
    podcast: Podcast;
    podcastId?: string;
  }) => (
    <div data-testid="podcast-info">
      <h2>{podcast.name}</h2>
      <p>{podcast.artist}</p>
      <div data-testid="podcast-id-prop">{podcastId}</div>
    </div>
  ),
}));

vi.mock("@/features/episode-detail/components/EpisodeInfo/EpisodeInfo", () => ({
  EpisodeInfo: ({ episode }: { episode: Episode }) => (
    <div data-testid="episode-info">
      <h1 id="episode-title">{episode.title}</h1>
      <p>{episode.description}</p>
      <div data-testid="episode-id">{episode.id}</div>
    </div>
  ),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{createQueryWithUIWrapper()({ children })}</MemoryRouter>
);

describe("EpisodeDetailPage", () => {
  const mockPodcastId = "1";
  const mockEpisodeId = "ep1";

  const defaultHookValues = {
    data: mockPodcastDetail,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({
      podcastId: mockPodcastId,
      episodeId: mockEpisodeId,
    });
    mockUsePodcastDetail.mockReturnValue(defaultHookValues);
  });

  it("renders episode detail page successfully", () => {
    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByTestId("podcast-info")).toBeInTheDocument();
    expect(screen.getByTestId("episode-info")).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Podcast information" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("displays correct episode information", () => {
    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    const episode = mockEpisodes.find((ep) => ep.id === mockEpisodeId);
    expect(screen.getByText(episode?.title || "")).toBeInTheDocument();
    expect(screen.getByTestId("episode-id")).toHaveTextContent(mockEpisodeId);
  });

  it("displays correct podcast information", () => {
    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByText(mockPodcastDetail.name)).toBeInTheDocument();
    expect(screen.getByText(mockPodcastDetail.artist)).toBeInTheDocument();
    expect(screen.getByTestId("podcast-id-prop")).toHaveTextContent(
      mockPodcastId,
    );
  });

  it("shows skeleton when loading", () => {
    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      isLoading: true,
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByTestId("episode-detail-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("podcast-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("episode-info")).not.toBeInTheDocument();
  });

  it("shows error message when there is an error loading podcast", () => {
    const errorMessage = "Failed to load podcast";
    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      error: new Error(errorMessage),
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Failed to load episode")).toBeInTheDocument();
    expect(screen.queryByTestId("podcast-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("episode-info")).not.toBeInTheDocument();
  });

  it("shows error message when podcast data is null", () => {
    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      data: null,
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Failed to load episode")).toBeInTheDocument();
  });

  it("shows error when episode is not found", () => {
    mockUseParams.mockReturnValue({
      podcastId: mockPodcastId,
      episodeId: "non-existent-episode",
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Episode not found")).toBeInTheDocument();
    expect(screen.queryByTestId("podcast-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("episode-info")).not.toBeInTheDocument();
  });

  it("calls usePodcastDetail with correct podcast ID", () => {
    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(mockUsePodcastDetail).toHaveBeenCalledWith(mockPodcastId);
  });

  it("handles missing podcast ID parameter", () => {
    mockUseParams.mockReturnValue({
      episodeId: mockEpisodeId,
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(mockUsePodcastDetail).toHaveBeenCalledWith("");
  });

  it("handles missing episode ID parameter", () => {
    mockUseParams.mockReturnValue({
      podcastId: mockPodcastId,
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Episode not found")).toBeInTheDocument();
  });

  it("handles missing both parameters", () => {
    mockUseParams.mockReturnValue({});

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(mockUsePodcastDetail).toHaveBeenCalledWith("");
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("has proper accessibility structure", () => {
    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    const aside = screen.getByRole("complementary", {
      name: "Podcast information",
    });
    const main = screen.getByRole("main");

    expect(aside).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(screen.getByText(mockEpisodes[0].title)).toHaveAttribute(
      "id",
      "episode-title",
    );
  });

  it("finds correct episode from episodes array", () => {
    const secondEpisodeId = "ep2";
    mockUseParams.mockReturnValue({
      podcastId: mockPodcastId,
      episodeId: secondEpisodeId,
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    const secondEpisode = mockEpisodes.find((ep) => ep.id === secondEpisodeId);
    expect(screen.getByText(secondEpisode?.title || "")).toBeInTheDocument();
    expect(screen.getByTestId("episode-id")).toHaveTextContent(secondEpisodeId);
  });

  it("handles empty episodes array", () => {
    const podcastWithoutEpisodes = {
      ...mockPodcastDetail,
      episodes: [],
    };

    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      data: podcastWithoutEpisodes,
    });

    render(<EpisodeDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Episode not found")).toBeInTheDocument();
  });
});

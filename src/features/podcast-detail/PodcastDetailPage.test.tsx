import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Episode } from "@/core/entities/Episode";
import type { Podcast } from "@/core/entities/Podcast";
import { mockPodcastDetail } from "@/test/fixtures/podcastFixtures";
import { createQueryWithUIWrapper } from "@/test/utils/testWrappers";
import { PodcastDetailPage } from "./PodcastDetailPage";

const mockUseParams = vi.fn();
const mockUsePodcastDetail = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

vi.mock("@/features/podcast-detail/hooks/usePodcastDetail", () => ({
  usePodcastDetail: (id: string) => mockUsePodcastDetail(id),
}));

vi.mock(
  "@/features/podcast-detail/components/PodcastDetailSkeleton/PodcastDetailSkeleton",
  () => ({
    PodcastDetailSkeleton: () => (
      <div data-testid="podcast-detail-skeleton">Loading...</div>
    ),
  }),
);

vi.mock("@/shared/components/PodcastInfo/PodcastInfo", () => ({
  PodcastInfo: ({ podcast }: { podcast: Podcast }) => (
    <div data-testid="podcast-info">
      <h1>{podcast.name}</h1>
      <p>{podcast.artist}</p>
    </div>
  ),
}));

vi.mock("@/features/podcast-detail/components/EpisodeList/EpisodeList", () => ({
  EpisodeList: ({
    episodes,
    podcastId,
  }: {
    episodes: Episode[];
    podcastId: string;
  }) => (
    <div data-testid="episode-list">
      <div data-testid="episodes-count">{episodes.length}</div>
      <div data-testid="podcast-id">{podcastId}</div>
    </div>
  ),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{createQueryWithUIWrapper()({ children })}</MemoryRouter>
);

describe("PodcastDetailPage", () => {
  const mockPodcastId = "123";

  const defaultHookValues = {
    data: mockPodcastDetail,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ podcastId: mockPodcastId });
    mockUsePodcastDetail.mockReturnValue(defaultHookValues);
  });

  it("renders podcast detail page successfully", () => {
    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByTestId("podcast-info")).toBeInTheDocument();
    expect(screen.getByTestId("episode-list")).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Podcast information" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("main", { name: "Episode list" }),
    ).toBeInTheDocument();
  });

  it("displays correct podcast information", () => {
    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByText(mockPodcastDetail.name)).toBeInTheDocument();
    expect(screen.getByText(mockPodcastDetail.artist)).toBeInTheDocument();
  });

  it("passes correct props to EpisodeList", () => {
    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByTestId("episodes-count")).toHaveTextContent(
      mockPodcastDetail.episodes.length.toString(),
    );
    expect(screen.getByTestId("podcast-id")).toHaveTextContent(mockPodcastId);
  });

  it("shows skeleton when loading", () => {
    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      isLoading: true,
    });

    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByTestId("podcast-detail-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("podcast-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("episode-list")).not.toBeInTheDocument();
  });

  it("shows error message when there is an error", () => {
    const errorMessage = "Failed to load podcast";
    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      error: new Error(errorMessage),
    });

    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText(`Error loading podcast: ${errorMessage}`),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("podcast-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("episode-list")).not.toBeInTheDocument();
  });

  it("shows error message for unknown error type", () => {
    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      error: "Some string error",
    });

    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("Error loading podcast: Unknown error"),
    ).toBeInTheDocument();
  });

  it("shows error when podcast ID is missing", () => {
    mockUseParams.mockReturnValue({});

    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Podcast ID not found")).toBeInTheDocument();
    expect(screen.queryByTestId("podcast-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("episode-list")).not.toBeInTheDocument();
  });

  it("shows error when podcast data is null", () => {
    mockUsePodcastDetail.mockReturnValue({
      ...defaultHookValues,
      data: null,
    });

    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Podcast not found")).toBeInTheDocument();
    expect(screen.queryByTestId("podcast-info")).not.toBeInTheDocument();
    expect(screen.queryByTestId("episode-list")).not.toBeInTheDocument();
  });

  it("calls usePodcastDetail with correct podcast ID", () => {
    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(mockUsePodcastDetail).toHaveBeenCalledWith(mockPodcastId);
  });

  it("calls usePodcastDetail with empty string when no podcast ID", () => {
    mockUseParams.mockReturnValue({});

    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(mockUsePodcastDetail).toHaveBeenCalledWith("");
  });

  it("has proper accessibility structure", () => {
    render(<PodcastDetailPage />, { wrapper: Wrapper });

    const aside = screen.getByRole("complementary", {
      name: "Podcast information",
    });
    const main = screen.getByRole("main", { name: "Episode list" });

    expect(aside).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });

  it("renders with undefined podcast ID from params", () => {
    mockUseParams.mockReturnValue({ podcastId: undefined });

    render(<PodcastDetailPage />, { wrapper: Wrapper });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Podcast ID not found")).toBeInTheDocument();
  });
});

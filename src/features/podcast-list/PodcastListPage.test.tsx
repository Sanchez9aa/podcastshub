import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  PodcastGridProps,
  SearchFilterProps,
} from "@/features/podcast-list/types";
import { mockPodcasts } from "@/test/fixtures/podcastFixtures";
import { createQueryWithUIWrapper } from "@/test/utils/testWrappers";
import { PodcastListPage } from "./PodcastListPage";

const mockUsePodcastList = vi.fn();

vi.mock("@/features/podcast-list/hooks/usePodcastList", () => ({
  usePodcastList: () => mockUsePodcastList(),
}));

vi.mock("@/features/podcast-list/components/PodcastGrid/PodcastGrid", () => ({
  PodcastGrid: ({
    podcasts,
    isLoading,
    hasMore,
    onLoadMore,
  }: PodcastGridProps) => (
    <div data-testid="podcast-grid">
      <div data-testid="podcasts-count">{podcasts.length}</div>
      <div data-testid="loading-state">{(isLoading ?? false).toString()}</div>
      <div data-testid="has-more">{(hasMore ?? false).toString()}</div>
      <button type="button" onClick={onLoadMore} data-testid="load-more">
        Load More
      </button>
    </div>
  ),
}));

vi.mock("@/features/podcast-list/components/SearchFilter/SearchFilter", () => ({
  SearchFilter: ({ value, onChange, placeholder }: SearchFilterProps) => (
    <input
      data-testid="search-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

vi.mock("@/shared/components/ui/Badge/Badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="podcast-count-badge">{children}</span>
  ),
}));

describe("PodcastListPage", () => {
  const defaultHookValues = {
    podcasts: mockPodcasts,
    searchTerm: "",
    setSearchTerm: vi.fn(),
    isLoading: false,
    error: null,
    podcastCount: mockPodcasts.length,
    totalFilteredCount: mockPodcasts.length,
    hasMore: false,
    loadMore: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePodcastList.mockReturnValue(defaultHookValues);
  });

  it("renders podcast list page with all components", () => {
    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByTestId("search-filter")).toBeInTheDocument();
    expect(screen.getByTestId("podcast-grid")).toBeInTheDocument();
    expect(
      screen.getByRole("main", { name: "Podcast list" }),
    ).toBeInTheDocument();
  });

  it("displays podcast count badge when not loading", () => {
    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByTestId("podcast-count-badge")).toBeInTheDocument();
    expect(screen.getByTestId("podcast-count-badge")).toHaveTextContent(
      mockPodcasts.length.toString(),
    );
  });

  it("hides podcast count badge when loading", () => {
    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      isLoading: true,
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.queryByTestId("podcast-count-badge")).not.toBeInTheDocument();
  });

  it("displays total count when has more podcasts", () => {
    const totalCount = 50;
    const currentCount = 10;

    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      podcastCount: currentCount,
      totalFilteredCount: totalCount,
      hasMore: true,
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByTestId("podcast-count-badge")).toHaveTextContent(
      `${currentCount} of ${totalCount}`,
    );
  });

  it("displays only current count when no more podcasts available", () => {
    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      hasMore: false,
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByTestId("podcast-count-badge")).toHaveTextContent(
      mockPodcasts.length.toString(),
    );
    expect(screen.queryByText(/of/)).not.toBeInTheDocument();
  });

  it("displays error state when there is an error", () => {
    const errorMessage = "Failed to load podcasts";
    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      error: new Error(errorMessage),
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Error loading podcasts")).toBeInTheDocument();
    expect(screen.getByText("Please try again later.")).toBeInTheDocument();
    expect(screen.queryByTestId("search-filter")).not.toBeInTheDocument();
    expect(screen.queryByTestId("podcast-grid")).not.toBeInTheDocument();
  });

  it("passes correct props to SearchFilter component", () => {
    const searchTerm = "tech";
    const setSearchTerm = vi.fn();

    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      searchTerm,
      setSearchTerm,
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    const searchInput = screen.getByTestId("search-filter");
    expect(searchInput).toHaveValue(searchTerm);
    expect(searchInput).toHaveAttribute("placeholder", "Filter podcasts...");
  });

  it("passes correct props to PodcastGrid component", () => {
    const hasMore = true;
    const loadMore = vi.fn();

    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      hasMore,
      loadMore,
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByTestId("podcasts-count")).toHaveTextContent(
      mockPodcasts.length.toString(),
    );
    expect(screen.getByTestId("loading-state")).toHaveTextContent("false");
    expect(screen.getByTestId("has-more")).toHaveTextContent("true");
  });

  it("handles loading state correctly", () => {
    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      isLoading: true,
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByTestId("loading-state")).toHaveTextContent("true");
  });

  it("has proper accessibility attributes", () => {
    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(
      screen.getByRole("main", { name: "Podcast list" }),
    ).toBeInTheDocument();
  });

  it("renders with empty podcasts array", () => {
    mockUsePodcastList.mockReturnValue({
      ...defaultHookValues,
      podcasts: [],
      podcastCount: 0,
    });

    render(<PodcastListPage />, { wrapper: createQueryWithUIWrapper() });

    expect(screen.getByTestId("podcasts-count")).toHaveTextContent("0");
    expect(screen.getByTestId("podcast-count-badge")).toHaveTextContent("0");
  });
});

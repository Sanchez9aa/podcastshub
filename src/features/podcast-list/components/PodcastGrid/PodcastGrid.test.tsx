import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { PodcastGrid } from "@/features/podcast-list/components/PodcastGrid/PodcastGrid";
import { mockPodcasts } from "@/test/fixtures/podcastFixtures";

vi.mock("@/shared/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: vi.fn(() => ({
    sentinelRef: { current: null },
  })),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("PodcastGrid", () => {
  it("should render skeleton when loading and no podcasts", () => {
    renderWithRouter(<PodcastGrid podcasts={[]} isLoading={true} />);

    // Should render skeleton grid - checking for multiple skeleton cards
    const skeletonElements = document.querySelectorAll(
      'div[class*="skeleton"]',
    );
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("should render empty state when no podcasts and not loading", () => {
    renderWithRouter(<PodcastGrid podcasts={[]} isLoading={false} />);

    expect(
      screen.getByText("No podcasts found matching your search."),
    ).toBeInTheDocument();
  });

  it("should render podcasts when available", () => {
    renderWithRouter(<PodcastGrid podcasts={mockPodcasts} isLoading={false} />);

    expect(screen.getByText("Tech Talk")).toBeInTheDocument();
    expect(screen.getByText("Music Matters")).toBeInTheDocument();
    expect(screen.getByText("Author: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Author: Jane Smith")).toBeInTheDocument();
  });

  it("should render loading trigger when hasMore is true", () => {
    renderWithRouter(
      <PodcastGrid
        podcasts={mockPodcasts}
        isLoading={false}
        hasMore={true}
        onLoadMore={vi.fn()}
      />,
    );

    expect(screen.getByText("Loading more podcasts...")).toBeInTheDocument();
  });

  it("should not render loading trigger when hasMore is false", () => {
    renderWithRouter(
      <PodcastGrid podcasts={mockPodcasts} isLoading={false} hasMore={false} />,
    );

    expect(
      screen.queryByText("Loading more podcasts..."),
    ).not.toBeInTheDocument();
  });

  it("should render each podcast with correct link", () => {
    renderWithRouter(<PodcastGrid podcasts={mockPodcasts} isLoading={false} />);

    const link1 = screen.getByRole("link", { name: /tech talk/i });
    const link2 = screen.getByRole("link", { name: /music matters/i });

    expect(link1).toHaveAttribute("href", "/podcast/1");
    expect(link2).toHaveAttribute("href", "/podcast/2");
  });

  it("should render podcasts while loading more", () => {
    renderWithRouter(
      <PodcastGrid
        podcasts={mockPodcasts}
        isLoading={true}
        hasMore={true}
        onLoadMore={vi.fn()}
      />,
    );

    expect(screen.getByText("Tech Talk")).toBeInTheDocument();
    expect(screen.getByText("Music Matters")).toBeInTheDocument();
    expect(screen.getByText("Loading more podcasts...")).toBeInTheDocument();
  });
});

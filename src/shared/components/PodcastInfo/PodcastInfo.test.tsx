import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { PodcastInfo } from "@/shared/components/PodcastInfo/PodcastInfo";
import { mockPodcasts } from "@/test/fixtures/podcastFixtures";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("PodcastInfo", () => {
  const testPodcast = mockPodcasts[0];

  it("renders podcast information without links when no podcastId", () => {
    render(
      <TestWrapper>
        <PodcastInfo podcast={testPodcast} />
      </TestWrapper>,
    );

    expect(screen.getByText(testPodcast.name)).toBeInTheDocument();
    expect(screen.getByText(`by ${testPodcast.artist}`)).toBeInTheDocument();
    expect(screen.getByText("Description:")).toBeInTheDocument();
    expect(screen.getByAltText(testPodcast.name)).toBeInTheDocument();

    // Should not have links when no podcastId
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(0);
  });

  it("renders podcast information with links when podcastId provided", () => {
    render(
      <TestWrapper>
        <PodcastInfo podcast={testPodcast} podcastId="456" />
      </TestWrapper>,
    );

    expect(screen.getByText(testPodcast.name)).toBeInTheDocument();
    expect(screen.getByText(`by ${testPodcast.artist}`)).toBeInTheDocument();

    // Should have links when podcastId is provided
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3); // image, title, and artist links

    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/podcast/456");
    });
  });

  it("uses podcast.id when no podcastId provided but still creates links", () => {
    render(
      <TestWrapper>
        <PodcastInfo podcast={testPodcast} podcastId={testPodcast.id} />
      </TestWrapper>,
    );

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", `/podcast/${testPodcast.id}`);
    });
  });

  it("renders image with correct attributes", () => {
    render(
      <TestWrapper>
        <PodcastInfo podcast={testPodcast} />
      </TestWrapper>,
    );

    const image = screen.getByAltText(testPodcast.name);
    expect(image).toHaveAttribute("src", testPodcast.image);
    expect(image.className).toContain("podcastImage");
  });

  it("renders as aside element", () => {
    const { container } = render(
      <TestWrapper>
        <PodcastInfo podcast={testPodcast} />
      </TestWrapper>,
    );

    expect(container.querySelector("aside")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const { container } = render(
      <TestWrapper>
        <PodcastInfo podcast={testPodcast} />
      </TestWrapper>,
    );

    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("sidebar");
    expect(screen.getByText(testPodcast.name).className).toContain(
      "podcastTitle",
    );
    expect(screen.getByText(`by ${testPodcast.artist}`).className).toContain(
      "podcastArtist",
    );
    expect(screen.getByText("Description:").className).toContain(
      "descriptionLabel",
    );
  });
});

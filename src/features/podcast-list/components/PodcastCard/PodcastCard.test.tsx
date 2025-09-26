import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { PodcastCard } from "@/features/podcast-list/components/PodcastCard/PodcastCard";
import { mockPodcasts } from "@/test/fixtures/podcastFixtures";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("PodcastCard", () => {
  const testPodcast = mockPodcasts[0];

  it("renders podcast information", () => {
    render(
      <TestWrapper>
        <PodcastCard podcast={testPodcast} />
      </TestWrapper>,
    );

    expect(screen.getByText(testPodcast.name)).toBeInTheDocument();
    expect(
      screen.getByText(`Author: ${testPodcast.artist}`),
    ).toBeInTheDocument();
  });

  it("creates a link to podcast detail page", () => {
    render(
      <TestWrapper>
        <PodcastCard podcast={testPodcast} />
      </TestWrapper>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/podcast/${testPodcast.id}`);
  });

  it("renders podcast image with correct styling and accessibility", () => {
    render(
      <TestWrapper>
        <PodcastCard podcast={testPodcast} />
      </TestWrapper>,
    );

    const image = screen.getByRole("img", {
      name: `Cover art for ${testPodcast.name} podcast`,
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", testPodcast.image);
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("applies correct CSS classes", () => {
    const { container } = render(
      <TestWrapper>
        <PodcastCard podcast={testPodcast} />
      </TestWrapper>,
    );

    const link = screen.getByRole("link");
    expect(link.className).toContain("card");

    // Check for CSS Module class names by checking if elements exist with class names containing the base names
    expect(
      container.querySelector('[class*="imageContainer"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[class*="image"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="content"]')).toBeInTheDocument();

    expect(screen.getByText(testPodcast.name).className).toContain("title");
    expect(
      screen.getByText(`Author: ${testPodcast.artist}`).className,
    ).toContain("artist");
  });

  it("renders title as h3 element", () => {
    render(
      <TestWrapper>
        <PodcastCard podcast={testPodcast} />
      </TestWrapper>,
    );

    const title = screen.getByText(testPodcast.name);
    expect(title.tagName).toBe("H3");
  });

  it("renders artist as paragraph element", () => {
    render(
      <TestWrapper>
        <PodcastCard podcast={testPodcast} />
      </TestWrapper>,
    );

    const artist = screen.getByText(`Author: ${testPodcast.artist}`);
    expect(artist.tagName).toBe("P");
  });

  it("handles long podcast names", () => {
    const longNamePodcast = {
      ...testPodcast,
      name: "This is a very long podcast name that might wrap to multiple lines",
    };

    render(
      <TestWrapper>
        <PodcastCard podcast={longNamePodcast} />
      </TestWrapper>,
    );

    expect(
      screen.getByText(
        "This is a very long podcast name that might wrap to multiple lines",
      ),
    ).toBeInTheDocument();
  });

  it("handles special characters in podcast data", () => {
    const specialCharPodcast = {
      ...testPodcast,
      name: "Podcast & Show with 'Quotes' and \"Double Quotes\"",
      artist: "Artist with @symbols and #hashtags",
    };

    render(
      <TestWrapper>
        <PodcastCard podcast={specialCharPodcast} />
      </TestWrapper>,
    );

    expect(
      screen.getByText("Podcast & Show with 'Quotes' and \"Double Quotes\""),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Author: Artist with @symbols and #hashtags"),
    ).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(
      <TestWrapper>
        <PodcastCard podcast={testPodcast} />
      </TestWrapper>,
    );

    // Check link accessibility
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "aria-label",
      `View ${testPodcast.name} podcast by ${testPodcast.artist}`,
    );

    // Check image accessibility
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute(
      "alt",
      `Cover art for ${testPodcast.name} podcast`,
    );
    expect(image).toHaveAttribute("loading", "lazy");
  });
});

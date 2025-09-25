import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { routes } from "@/router/routes";
import { Layout } from "@/shared/components/layout/Layout/Layout";
import { LoadingIndicator } from "@/shared/components/layout/LoadingIndicator/LoadingIndicator";

// Lazy load all pages
const PodcastListPage = lazy(() =>
  import("@/features/podcast-list/PodcastListPage").then((m) => ({
    default: m.PodcastListPage,
  })),
);
const PodcastDetailPage = lazy(() =>
  import("@/features/podcast-detail/PodcastDetailPage").then((m) => ({
    default: m.PodcastDetailPage,
  })),
);
const EpisodeDetailPage = lazy(() =>
  import("@/features/episode-detail/EpisodeDetailPage").then((m) => ({
    default: m.EpisodeDetailPage,
  })),
);

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingIndicator />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <SuspenseWrapper>
                <PodcastListPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path={routes.podcastDetail}
            element={
              <SuspenseWrapper>
                <PodcastDetailPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path={routes.episodeDetail}
            element={
              <SuspenseWrapper>
                <EpisodeDetailPage />
              </SuspenseWrapper>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

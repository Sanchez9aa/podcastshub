interface Routes {
  home: string;
  podcastDetail: string;
  episodeDetail: string;
}

export const routes: Routes = {
  home: "/",
  podcastDetail: "/podcast/:podcastId",
  episodeDetail: "/podcast/:podcastId/episode/:episodeId",
} as const;

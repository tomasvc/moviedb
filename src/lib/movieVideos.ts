import type { MovieVideosResponse } from "@/types/api";

export type MovieVideo = MovieVideosResponse["results"][number];

const YOUTUBE_SITE = "youtube";

function isYoutube(video: MovieVideo): boolean {
  return video.site?.toLowerCase() === YOUTUBE_SITE && Boolean(video.key);
}

function videoScore(video: MovieVideo): number {
  let score = 0;
  if (video.type === "Trailer") score += 100;
  if (video.type === "Teaser") score += 50;
  if (video.official) score += 40;
  if (typeof video.size === "number") score += video.size;
  if (video.published_at) {
    score += new Date(video.published_at).getTime() / 1e12;
  }
  return score;
}

export function getYoutubeVideos(videos: MovieVideo[]): MovieVideo[] {
  return [...videos.filter(isYoutube)].sort(
    (a, b) => videoScore(b) - videoScore(a),
  );
}

export function pickDefaultVideo(videos: MovieVideo[]): MovieVideo | null {
  const youtube = getYoutubeVideos(videos);
  return youtube[0] ?? null;
}

export function youtubeWatchUrl(key: string): string {
  return `https://www.youtube.com/watch?v=${key}`;
}

export function toVideoJsSource(video: MovieVideo) {
  return {
    src: youtubeWatchUrl(video.key),
    type: "video/youtube",
  };
}

export function buildVideoJsOptions(
  video: MovieVideo,
  autoplay = true,
): {
  autoplay: boolean;
  controls: boolean;
  responsive: boolean;
  fluid: boolean;
  techOrder: string[];
  sources: { src: string; type: string }[];
  youtube: { iv_load_policy: number; modestbranding: number; rel: number };
} {
  return {
    autoplay,
    controls: true,
    responsive: true,
    fluid: true,
    techOrder: ["youtube"],
    sources: [toVideoJsSource(video)],
    youtube: {
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
    },
  };
}

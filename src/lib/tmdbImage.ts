const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export type TmdbBackdropSize = "w780" | "w1280" | "original";

export function tmdbBackdropUrl(
  path: string | null | undefined,
  size: TmdbBackdropSize = "w1280",
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

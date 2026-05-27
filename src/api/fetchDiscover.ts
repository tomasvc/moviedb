import qs from "qs";

export const fetchDiscover = async (
  genres: { id: number; selected?: boolean }[] = [],
  country: string = "",
  releaseYear: {
    type: string;
    from?: string;
    to?: string;
    releaseYear?: string;
    value?: number;
  } = { type: "" },
  page: number = 1
) => {
  const selectedGenres = genres
    .filter((genre) => genre.selected)
    .map((genre) => genre.id)
    .join(",");

  const releaseYearParams =
    releaseYear.type === "range" && releaseYear.from && releaseYear.to
      ? {
        "primary_release_date.gte": `${releaseYear.from}-01-01`,
        "primary_release_date.lte": `${releaseYear.to}-12-31`,
      }
      : releaseYear.type === "exact" &&
        (releaseYear.releaseYear || releaseYear.value)
        ? { year: releaseYear.releaseYear || releaseYear.value }
        : {};

  const queryParams = {
    ...(selectedGenres && { with_genres: selectedGenres }),
    ...(country && { with_origin_country: country }),
    page: page.toString(),
    ...releaseYearParams,
  };

  const url = new URL("/discover/movie", "https://api.themoviedb.org/3");

  const serializedParams = qs.stringify(queryParams, { arrayFormat: "comma" });
  const additionalParams = new URLSearchParams(serializedParams);

  url.searchParams.set("api_key", process.env.TMDB_API_KEY || "");
  url.searchParams.set("language", "en-US");

  additionalParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

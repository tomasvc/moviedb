const API_KEY = process.env.TMDB_API_KEY;
import axios from "axios";
import qs from "qs";

export const fetchDiscover = async (
  genres: { id: number; selected: boolean }[] = [],
  country: string = "",
  releaseYear: {
    type: string;
    from?: string;
    to?: string;
    releaseYear?: string;
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
      : releaseYear.type === "exact" && releaseYear.releaseYear
      ? { year: releaseYear.releaseYear }
      : {};


  const queryParams = {
    api_key: API_KEY || "",
    language: "en-US",
    with_genres: selectedGenres || undefined,
    with_origin_country: country || undefined,
    page: page.toString(),
    ...releaseYearParams,
  };


  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: queryParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "comma" }),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch: ${error.response?.statusText || error.message}`
    );
  }
};

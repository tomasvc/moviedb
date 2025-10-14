import { apiClient } from "@/api/index";
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

  const response = await apiClient.get("/discover/movie", {
    params: queryParams,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "comma" }),
  });

  return response.data;
};

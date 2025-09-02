const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

import axios, { AxiosResponse } from "axios";

export const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response);
      throw new Error(
        `Data fetching failed with status ${error.response.status}`
      );
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response received for the data request.");
    } else {
      console.error("Error message:", error.message);
      throw new Error("Error in setting up the data request.");
    }
  }
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error("Error response:", error.response);
      return Promise.reject(
        new Error(
          "Data fetching failed with status " +
            error.response.data.status_message
        )
      );
    } else if (error.request) {
      console.error("Error request:", error.request);
      return Promise.reject(
        new Error("No response received for the data request.")
      );
    } else {
      console.error("Error message:", error.message);
      return Promise.reject(new Error("Error in setting up the data request."));
    }
  }
);

const fetchData = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  const response = await apiClient.get<T>(endpoint, { params });
  return response.data;
};

export const api = {
  popularMovies:
    "/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc",
  trendingMovies:
    "/trending/movie/week?include_adult=false&include_video=false&language=en-US",
  upcomingMovies: `/movie/upcoming?language=en-US`,
  multiSearch: "/trending/movie/week",
  movieGenres: "/genre/movie/list",
  movieList: (id: string) => `/list/${id}`,
  movie: (id: string) => `/movie/${id}`,
  credits: (id: string) => `/movie/${id}/credits`,
  reviews: (id: string) => `/movie/${id}/reviews`,
  keywords: (id: string) => `/movie/${id}/keywords`,
  person: (id: string) => `/person/${id}`,
  personExternals: (id: string) => `/person/${id}/external_ids`,
  personCombinedCredits: (id: string) => `/person/${id}/combined_credits`,
  itemsByKeyword: (keywordId: string) =>
    `/discover/movie?with_keywords=${keywordId}`,
  keyword: (id: string) => `/keyword/${id}`,
  similarMovies: (id: string) => `/movie/${id}/similar`,
  recommendedMovies: (id: string) => `/movie/${id}/recommendations`,
  movieImages: (id: string) => `/movie/${id}/images`,
  movieVideos: (id: string) => `/movie/${id}/videos`,
  personImages: (id: string) => `/person/${id}/images`,
  collection: (id: string) => `/collection/${id}`,
};

export const fetchPopularMovies = async (page: number): Promise<any> => {
  return fetchData(api.popularMovies, { page });
};

export const fetchTrendingMovies = async (): Promise<any> => {
  return fetchData(`${api.trendingMovies}`);
};

export const fetchUpcomingMovies = async (): Promise<any> => {
  return fetchData(`${api.upcomingMovies}`);
};

export const multiSearch = async (query: string, page: number = 1) => {
  return fetchData(api.multiSearch, { query, page });
};

export const movieSearch = async (query: string, page: number = 1) => {
  return fetchData("/search/movie", { query, page });
};

export const personSearch = async (query: string, page: number = 1) => {
  return fetchData("/search/person", { query, page });
};

export const fetchMovieDetails = async (id: string): Promise<any> => {
  return fetchData(api.movie(id));
};

export const fetchMovieCredits = async (id: string): Promise<any> => {
  return fetchData(api.credits(id));
};

export const fetchMovieReviews = async (id: string): Promise<any> => {
  return fetchData(api.reviews(id));
};

export const fetchMovieKeywords = async (id: string): Promise<any> => {
  return fetchData(api.keywords(id));
};

export const fetchPersonDetails = async (id: string): Promise<any> => {
  return fetchData(api.person(id));
};

export const fetchPersonExternals = async (id: string): Promise<any> => {
  return fetchData(api.personExternals(id));
};

export const fetchPersonCombinedCredits = async (id: string): Promise<any> => {
  return fetchData(api.personCombinedCredits(id));
};

export const fetchItemsByKeyword = async (
  keywordId: string,
  page: number
): Promise<any> => {
  return fetchData(api.itemsByKeyword(keywordId), { page });
};

export const fetchKeyword = async (id: string): Promise<any> => {
  return fetchData(api.keyword(id));
};

export const fetchSimilarMovies = async (id: string): Promise<any> => {
  return fetchData(api.similarMovies(id));
};

export const fetchRecommendedMovies = async (id: string): Promise<any> => {
  return fetchData(api.recommendedMovies(id));
};

export const fetchMovieImages = async (id: string): Promise<any> => {
  return fetchData(api.movieImages(id));
};

export const fetchMovieVideos = async (id: string): Promise<any> => {
  return fetchData(api.movieVideos(id));
};

export const fetchPersonImages = async (id: string): Promise<any> => {
  return fetchData(api.personImages(id));
};

export const fetchCollection = async (id: string): Promise<any> => {
  return fetchData(api.collection(id));
};

export const fetchMovieGenres = async (): Promise<any> => {
  return fetchData(api.movieGenres);
};

// Removed useApi hook - convert to client-side hook if needed

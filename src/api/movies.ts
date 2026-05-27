import { ApiData, APIResponse, Credits, Movie, MovieKeywordsResponse, MovieImagesResponse, MovieVideosResponse, Genre } from "@/types/api";
import { api } from "./endpoints";
import { fetchData, DEFAULT_PARAMS } from "./client";

export const fetchPopularMovies = async (
    page: number = 1
): Promise<APIResponse<Movie>> => {
    return fetchData(api.popularMovies, {
        ...DEFAULT_PARAMS,
        page
    });
};

export const fetchTrendingMovies = async (
    page: number = 1
): Promise<APIResponse<Movie>> => {
    return fetchData(api.trendingMovies, {
        ...DEFAULT_PARAMS,
        page
    });
};

export const fetchUpcomingMovies = async (
    page: number = 1
): Promise<APIResponse<Movie>> => {
    return fetchData(api.upcomingMovies, {
        ...DEFAULT_PARAMS,
        page
    });
};

export const fetchMovieDetails = async (id: string): Promise<Movie> => {
    return fetchData(api.movie(id));
};

export const fetchMovieCredits = async (id: string): Promise<Credits> => {
    return fetchData(api.credits(id));
};

export const fetchMovieReviews = async (id: string): Promise<ApiData> => {
    return fetchData(api.reviews(id));
};

export const fetchMovieKeywords = async (
    id: string
): Promise<MovieKeywordsResponse> => {
    return fetchData(api.keywords(id));
};

export const fetchSimilarMovies = async (
    id: string
): Promise<APIResponse<Movie>> => {
    return fetchData(api.similarMovies(id));
};

export const fetchRecommendedMovies = async (id: string): Promise<ApiData> => {
    return fetchData(api.recommendedMovies(id));
};

export const fetchMovieImages = async (
    id: string
): Promise<MovieImagesResponse> => {
    return fetchData(api.movieImages(id));
};

export const fetchMovieVideos = async (
    id: string
): Promise<MovieVideosResponse> => {
    return fetchData(api.movieVideos(id));
};

export const fetchCollection = async (id: string): Promise<ApiData> => {
    return fetchData(api.collection(id));
};

export const fetchMovieGenres = async (): Promise<{ genres: Genre[] }> => {
    return fetchData(api.movieGenres);
};
"use client";

import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieReviews,
  fetchMovieKeywords,
  fetchRecommendedMovies,
} from "@/api";
import { CircularProgress } from "@mui/material";
import { MovieClient } from "./MovieClient";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function MoviePage({ params }: Props) {
  const { id } = use(params);
  const movieId = id;

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });

  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ["credits", id],
    queryFn: () => fetchMovieCredits(id),
    enabled: !!id && !!movie,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchMovieReviews(id),
    enabled: !!id && !!movie,
  });

  const { data: keywords, isLoading: keywordsLoading } = useQuery({
    queryKey: ["keywords", id],
    queryFn: () => fetchMovieKeywords(id),
    enabled: !!id && !!movie,
  });

  const { data: recommendations, isLoading: recommendationsLoading } = useQuery(
    {
      queryKey: ["recommendations", id],
      queryFn: () => fetchRecommendedMovies(id),
      enabled: !!id && !!movie,
    }
  );

  if (!movie || movieLoading) {
    return <Loading />;
  }

  if (movieError) {
    return <div>Error loading movie: {movieError.message}</div>;
  }

  return (
    <MovieClient
      movieId={movieId}
      movie={movie}
      credits={credits || { cast: [], crew: [] }}
      reviews={reviews?.results || []}
      keywords={keywords?.keywords || []}
      recommendations={recommendations?.results || []}
    />
  );
}

const Loading = () => {
  return (
    <div className="bg-[#192231]-50 min-h-screen flex flex-col items-center justify-center font-roboto animate-fadeIn">
      <div className="flex flex-col items-center">
        <CircularProgress className="text-blue-400 w-24 h-24 mb-6" />
        <h1 className="text-white text-xl font-semibold mb-2 animate-pulse">
          Loading, please wait...
        </h1>
        <p className="text-slate-300 text-sm">Fetching your movie magic</p>
      </div>
    </div>
  );
};

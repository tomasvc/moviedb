import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieReviews,
  fetchMovieKeywords,
  fetchRecommendedMovies,
} from "@/api";
import { Suspense } from "react";
import { SideMenu } from "@/components/SideMenu";
import Link from "next/link";
import { Header } from "@/components/Header";
import { MovieItem } from "@/components/MovieItem";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import moment from "moment";
import { Review } from "@/components/Review";
import Image from "next/image";
import { Metadata } from "next";
import { MovieClient } from "./MovieClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await fetchMovieDetails(id);
  
  return {
    title: movie?.title || movie?.name || movie?.original_title || "Movie",
    description: movie?.overview?.slice(0, 150) || "Movie details",
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movieId = id;
  const movie = await fetchMovieDetails(movieId);

  if (!movie) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <MovieClient movieId={movieId} movie={movie} />
    </Suspense>
  );
}

const Loading = () => {
  return (
    <div className="bg-[#192231]-50 overflow-x-hidden" suppressHydrationWarning>
      <Header open={false} setOpen={() => {}} />
      <SideMenu />
      <main
        className={clsx(
          "bg-[#192231] w-full mx-auto transition-all animate-fadeUp",
          {
            "blur-md": false,
          }
        )}
      >
        <div className="w-full h-screen flex items-center justify-center">
          <CircularProgress className="text-blue-400 w-32 h-32" />
        </div>
      </main>
    </div>
  );
};

"use client";

import { useEffect, useState, useRef } from "react";
// import { MovieItem } from "@/components/MovieItem";
import { MovieItem } from "@components/MovieItemNew";
import { HomeMovieHero } from "@/components/HomeMovieHero";
import { Header } from "@/components/Header";
import { useHeaderContext } from "@/contexts/headerContext";
import { SideMenu } from "@/components/SideMenu";
import { Video } from "@/components/Video";
import { HomeHero } from "@/components/HomeHero";
import "video.js/dist/video-js.css";
import "videojs-youtube";
import { XIcon } from "@/components/Icons";
// import {
//   fetchPopularMovies,
//   fetchTrendingMovies,
//   fetchUpcomingMovies,
//   fetchMovieGenres,
//   fetchMovieVideos,
// } from "@/api/movies";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/api";

type stateProps = {
  movies: any[];
  videos: { id: number | null; results: any[] };
  selectedMovieIndex: number | null;
  rowLength: number;
  showVideo: boolean;
  selectedList: string;
  loadedPages: number;
};

export default function Home() {
  const [state, setState] = useState<stateProps>({
    movies: [],
    videos: { id: null, results: [] },
    selectedMovieIndex: null,
    rowLength: 6,
    showVideo: false,
    selectedList: "Trending",
    loadedPages: 0,
  });
  const { open, setOpen } = useHeaderContext();
  const playerRef = useRef(null);
  const loadedPagesRef = useRef(state.loadedPages);
  const [videoJsOptions, setVideoJsOptions] = useState({
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://www.youtube.com/watch?v=WnYjuLNoP8E",
        type: "video/youtube",
      },
    ],
  });
  const { data: genresData } = useQuery({
    queryKey: ["genres", "movie"],
    queryFn: () =>
      fetch("/api/tmdb/movies?type=movie-genres").then((res) => res.json()),
    staleTime: 1000 * 60 * 60 * 24,
  });
  const genres = genresData?.genres || [];

  const handleMovieClick = async (index: number) => {
    setState((prevState) => ({ ...prevState, selectedMovieIndex: index }));

    const movie = movies[index];
    if (!movie) return;

    const movieId = movie.id;
    const selectedMovieElement = document.querySelector(`#movie-${movieId}`);

    if (selectedMovieElement) {
      selectedMovieElement.scrollIntoView({ behavior: "smooth" });
    }

    try {
      const videos = await fetch(
        "/api/tmdb/movies?type=movie-videos&id=" + movieId,
      ).then((res) => res.json());

      // TMDB `/movie/{id}/videos` returns an object with `results` array.
      // We only select YouTube trailers since the player is configured for YouTube tech.
      const results = Array.isArray(videos?.results) ? videos.results : [];
      setState((prevState) => ({
        ...prevState,
        videos: { id: movieId, results },
      }));

      const youtubeTrailers = results.filter((v: any) => {
        const site = typeof v?.site === "string" ? v.site.toLowerCase() : "";
        return v?.type === "Trailer" && site === "youtube";
      });

      const chosen = youtubeTrailers[0] ?? results.find((v: any) => {
        const site = typeof v?.site === "string" ? v.site.toLowerCase() : "";
        return site === "youtube";
      });

      if (chosen?.key) {
        setVideoJsOptions((prev) => ({
          ...prev,
          sources: [
            {
              src: `https://www.youtube.com/watch?v=${chosen.key}`,
              type: "video/youtube",
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch videos for movie", movieId, error);
    }
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on("waiting", () => {});
    player.on("dispose", () => {});
  };

  const { data, fetchNextPage, isFetchingNextPage, error } = useInfiniteQuery({
    queryKey: ["movies", state.selectedList.toLowerCase()],
    queryFn: ({ pageParam = 1 }) => {
      switch (state.selectedList) {
        case "Popular":
          return fetch("/api/tmdb/movies?type=popular&page=" + pageParam).then(
            (res) => res.json(),
          );
        case "Trending":
          return fetch("/api/tmdb/movies?type=trending&page=" + pageParam).then(
            (res) => res.json(),
          );
        case "Upcoming":
          return fetch("/api/tmdb/movies?type=upcoming&page=" + pageParam).then(
            (res) => res.json(),
          );
        default:
          return fetch("/api/tmdb/movies?type=trending&page=" + pageParam).then(
            (res) => res.json(),
          );
      }
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Deduplicate movies by ID to prevent duplicates from API
  const allMovies = data?.pages.flatMap((page: any) => page.results) || [];
  const movies = allMovies.filter(
    (movie: Movie, index: number, self: Movie[]) =>
      index === self.findIndex((m: Movie) => m?.id === movie?.id),
  );
  const moviesRef = useRef(movies);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setRowBasedOnWidth = () => {
      const width = window.innerWidth;
      const rowLength =
        width > 2400
          ? 10
          : width > 2000
            ? 6
            : width > 1700
              ? 6
              : width > 1500
                ? 6
                : width > 850
                  ? 4
                  : width > 650
                    ? 2
                    : 2;

      setState((prevState) => ({ ...prevState, rowLength }));
    };

    setRowBasedOnWidth();
    window.addEventListener("resize", setRowBasedOnWidth, false);

    return () => {
      window.removeEventListener("resize", setRowBasedOnWidth, false);
    };
  }, []);

  useEffect(() => {
    if (state.selectedMovieIndex !== undefined) {
      const movieId = movies[state.selectedMovieIndex! as number]?.id;
      const selectedMovieElement = document.querySelector(`#movie-${movieId}`);
      const selectedHeroElement = document.querySelector(`#hero-${movieId}`);

      if (selectedMovieElement && selectedHeroElement) {
        if (document.body.clientWidth > 1500) {
          if (selectedMovieElement instanceof HTMLElement) {
            window.scrollTo({
              top: selectedMovieElement.offsetTop - 80,
              behavior: "smooth",
            });
          }
        } else {
          if (selectedHeroElement instanceof HTMLElement) {
            window.scrollTo({
              top: selectedHeroElement.offsetTop - 65,
              behavior: "smooth",
            });
          }
        }
      }
    }
  }, [state.selectedMovieIndex]);

  useEffect(() => {
    loadedPagesRef.current = state.loadedPages;
  }, [state.loadedPages]);

  useEffect(() => {
    moviesRef.current = movies;
  }, [movies]);

  useEffect(() => {
    if (state.showVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [state.showVideo]);

  const rows = Array.from(
    { length: Math.ceil(movies.length / state.rowLength) },
    (_, rowIndex) => (
      <div key={`row-${rowIndex}-${state.rowLength}-${state.selectedList}`}>
        <div
          className="grid w-full gap-x-2"
          style={{
            gridTemplateColumns: `repeat(${state.rowLength}, minmax(0, 1fr))`,
          }}
        >
          {movies
            .slice(rowIndex * state.rowLength, (rowIndex + 1) * state.rowLength)
            .map((movie: Movie, index: number) => (
              <div
                key={`${movie?.id}-${rowIndex}-${index}`}
                className="cursor-pointer flex"
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    selectedMovieIndex: rowIndex * prevState.rowLength + index,
                  }));
                  handleMovieClick(rowIndex * state.rowLength + index);
                }}
              >
                <div className="w-full h-full cursor-pointer">
                  <MovieItem
                    movie={movie}
                    genres={genres}
                    isSelected={
                      movies[state.selectedMovieIndex! as number]?.id ===
                      movie?.id
                    }
                  />
                </div>
              </div>
            ))}
        </div>

        {state.selectedMovieIndex !== null &&
          Math.floor(state.selectedMovieIndex / state.rowLength) ===
            rowIndex && (
            <HomeMovieHero
              movie={movies[state.selectedMovieIndex! as number]}
              genres={genres}
              setState={setState}
              videoAvailable={
                state.videos.id ===
                movies[state.selectedMovieIndex! as number]?.id
              }
            />
          )}
      </div>
    ),
  );

  if (typeof window !== "undefined") {
    return (
      <div className="bg-[#111824] font-roboto overflow-x-hidden">
        <main className="relative flex bg-[#111824] w-full min-h-screen lg:mx-auto transition-all">
          <div className="w-full relative">
            <Header
              open={open}
              setOpen={setOpen}
              selectedList={state.selectedList}
              setState={setState}
            />
            <div className="pt-14 animate-fadeUp flex flex-col justify-center mx-auto">
              {error && <div>Failed to load.</div>}
              {!data && <div>Loading...</div>}
              <div className="flex flex-col gap-2 p-2">
                {rows.map((row) => (
                  <div key={row.key}>{row}</div>
                ))}
              </div>
              {data && (
                <div className="flex justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="relative overflow-hidden bg-gradient-to-r from-[#0d0628] via-[#5937ef] to-[#0d0628] hover:via-[#6a49ff] disabled:opacity-40 disabled:text-white/80 text-white text-sm tracking-tighter font-semibold px-10 py-6 w-full uppercase transition shadow-xl shadow-purple-950/60 mb-2 mx-2 rounded-lg"
                  >
                    <span
                      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
                      aria-hidden="true"
                    >
                      <span className="absolute inset-y-0 left-[3%] w-8 skew-x-12 bg-white/10" />
                      <span className="absolute inset-y-0 left-[8%] w-3 skew-x-12 bg-white/5 hidden lg:block" />
                      <span className="absolute inset-y-0 left-[14%] w-6 skew-x-12 bg-white/10" />
                      <span className="absolute inset-y-0 left-[20%] w-3 skew-x-12 bg-white/5 hidden lg:block" />
                      <span className="absolute inset-y-0 left-[27%] w-8 skew-x-12 bg-white/10" />
                      <span className="absolute inset-y-0 left-[34%] w-3 skew-x-12 bg-white/5 hidden lg:block" />
                      <span className="absolute inset-y-0 left-[41%] w-6 skew-x-12 bg-white/10" />
                      <span className="absolute inset-y-0 left-[48%] w-3 skew-x-12 bg-white/5 hidden lg:block" />
                      <span className="absolute inset-y-0 left-[55%] w-8 skew-x-12 bg-white/10" />
                      <span className="absolute inset-y-0 left-[62%] w-3 skew-x-12 bg-white/5 hidden lg:block" />
                      <span className="absolute inset-y-0 left-[69%] w-6 skew-x-12 bg-white/10" />
                      <span className="absolute inset-y-0 left-[76%] w-3 skew-x-12 bg-white/5 hidden lg:block" />
                      <span className="absolute inset-y-0 left-[83%] w-8 skew-x-12 bg-white/10" />
                      <span className="absolute inset-y-0 left-[90%] w-3 skew-x-12 bg-white/5 hidden lg:block" />
                      <span className="absolute inset-y-0 left-[95%] w-6 skew-x-12 bg-white/10" />
                    </span>
                    <span className="relative z-10">
                      {isFetchingNextPage ? "Loading..." : "Show more"}
                    </span>
                  </button>
                </div>
              )}
            </div>
            {state.showVideo && (
              <div className="fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-sm flex justify-center items-center w-full h-screen animate-fadeInScaleUp transition-all">
                <button
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      showVideo: false,
                    }))
                  }
                  className="absolute top-5 right-5 z-10 text-white hover:bg-slate-500/20 active:bg-slate-500/30 transition active:transition-none ease-out duration-300 rounded-full p-2"
                >
                  <XIcon
                    className="w-8 sm:w-12 h-auto text-gray-200"
                    strokeWidth={0.5}
                  />
                </button>
                <Video options={videoJsOptions} onReady={handlePlayerReady} />
              </div>
            )}
          </div>
        </main>

        <footer></footer>
      </div>
    );
  }
}

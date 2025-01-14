import { useEffect, useState, useRef } from "react";
import { api, fetchMovieGenres, fetchMovieVideos } from "@api";
import { MovieItem } from "@components/MovieItem";
import { HomeMovieHero } from "@components/HomeMovieHero";
import { Header } from "@components/Header";
import { useHeaderContext } from "@contexts/headerContext";
import { SideMenu } from "@components/SideMenu";
import { Video } from "@components/Video";
import { HomeHero } from "@components/HomeHero";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import Head from "next/head";
import "video.js/dist/video-js.css";
import "videojs-youtube";
import { XIcon } from "@components/Icons";

type stateProps = {
  movies: any[];
  genres: any[];
  videos: { id: number | null; results: any[] };
  selectedMovieIndex: number | null;
  rowLength: number;
  showVideo: boolean;
  selectedList: string;
  loadedPages: number;
};

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export default function Home() {
  const [state, setState] = useState<stateProps>({
    movies: [],
    genres: [],
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
      const videos = await fetchMovieVideos(movieId);
      if (videos) {
        setState((prevState) => ({
          ...prevState,
          videos: { id: movieId, results: videos.results },
        }));

        const filteredVideos = videos.results?.filter(
          (v) => v.type === "Trailer"
        );
        if (filteredVideos.length > 0) {
          setVideoJsOptions({
            ...videoJsOptions,
            sources: [
              {
                src: `https://youtube.com/watch?v=${filteredVideos[0].key}`,
                type: "video/youtube",
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch videos for movie", movieId, error);
    }
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {});
    player.on("dispose", () => {});
  };

  const BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = process.env.TMDB_API_KEY;

  const { data, isValidating, error, size, setSize } = useSWRInfinite(
    (index) =>
      `${BASE_URL}${
        state.selectedList === "Popular"
          ? api.popularMovies
          : state.selectedList === "Trending"
          ? api.trendingMovies
          : api.upcomingMovies
      }&page=${index + 1}&api_key=${API_KEY}`,
    fetcher
  );

  const movies = data
    ? data.flatMap((page) =>
        page.results.filter(
          (movie: any) =>
            !data
              .slice(0, data.indexOf(page))
              .flatMap((p) => p.results)
              .some((m) => m.id === movie.id)
        )
      )
    : [];

  const moviesRef = useRef(movies);

  useEffect(() => {
    async function fetchData() {
      const movieGenres = await fetchMovieGenres();
      setState((prevState) => ({
        ...prevState,
        genres: movieGenres.genres,
      }));
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setRowBasedOnWidth = () => {
      const width = window.innerWidth;
      const rowLength =
        width > 2400
          ? 10
          : width > 2000
          ? 7
          : width > 1700
          ? 6
          : width > 1500
          ? 5
          : width > 850
          ? 4
          : width > 650
          ? 3
          : 2;

      setState((prevState) => ({ ...prevState, rowLength }));
    };

    setRowBasedOnWidth();
    window.addEventListener("resize", setRowBasedOnWidth, false);

    return () => {
      window.removeEventListener("resize", setRowBasedOnWidth, false);
    };
  }, [size]);

  useEffect(() => {
    if (state.selectedMovieIndex !== undefined) {
      const movieId = movies[state.selectedMovieIndex!]?.id;
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
      <div key={`${rowIndex}-${state.rowLength}`}>
        <div className="flex justify-start w-full min-[430px]:w-fit mx-auto">
          {movies
            .slice(rowIndex * state.rowLength, (rowIndex + 1) * state.rowLength)
            .map((movie, index) => (
              <div
                key={movie.id}
                className="w-1/2 lg:w-auto cursor-pointer flex"
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    selectedMovieIndex: rowIndex * prevState.rowLength + index,
                  }));
                  handleMovieClick(rowIndex * state.rowLength + index);
                }}
              >
                <div
                  className={`p-4 w-full h-full cursor-pointer ${
                    movies[state.selectedMovieIndex!]?.id === movie.id
                      ? "bg-gray-900 border-b-4 border-slate-200 rounded-tl rounded-tr transition ease-in"
                      : "hover:bg-slate-800 rounded transition ease-out duration-300"
                  }`}
                >
                  <MovieItem movie={movie} genres={state.genres} />
                </div>
              </div>
            ))}
        </div>

        {state.selectedMovieIndex !== null &&
          Math.floor(state.selectedMovieIndex / state.rowLength) ===
            rowIndex && (
            <HomeMovieHero
              movie={movies[state.selectedMovieIndex!]}
              genres={state.genres}
              setState={setState}
              videoAvailable={
                state.videos.id === movies[state.selectedMovieIndex!].id
              }
            />
          )}
      </div>
    )
  );

  if (typeof window !== "undefined") {
    return (
      <div className="bg-[#192231] font-roboto overflow-x-hidden">
        <Head>
          <title>Movies</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="relative flex bg-[#192231] w-full min-h-screen lg:mx-auto transition-all">
          <SideMenu selected="home" />
          <div className="w-full relative">
            <Header open={open} setOpen={setOpen} />
            <div className="mb-20 animate-fadeUp flex flex-col justify-center mx-auto">
              <HomeHero selectedList={state.selectedList} setState={setState} />
              {error && <div>Failed to load.</div>}
              {!data && <div>Loading...</div>}
              {rows}
              {data && (
                <div className="flex justify-center mx-auto pt-10">
                  <button
                    onClick={() => setSize(size + 1)}
                    disabled={isValidating}
                    className="bg-[#5937ef] hover:bg-[#6a49ff] disabled:bg-[#6a49ff]/40 disabled:text-white/80 text-white text-xs font-medium px-10 py-2.5 w-fit h-fit rounded-full uppercase transition"
                  >
                    {isValidating ? "Loading..." : "Show more"}
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

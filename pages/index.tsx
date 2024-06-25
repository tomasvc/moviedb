import { useEffect, useState, useRef } from "react";
import { fetchMovieGenres, fetchMovieVideos } from "../api";
import { MovieItem } from "../components/MovieItem";
import { Header } from "../components/Header";
import { useHeaderContext } from "../contexts/headerContext";
import { SideMenu } from "../components/SideMenu";
import { PlayIcon } from "../components/Icons";
import { Video } from "../components/Video";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import moment from "moment";
import "video.js/dist/video-js.css";
import "videojs-youtube";

const fetcher = (url: string): Promise<any> =>
  axios.get(url).then((res) => res.data);

export default function Home() {
  const [state, setState] = useState({
    movies: [],
    genres: [],
    videos: [],
    selectedMovieIndex: null,
    rowLength: 6,
    showVideo: false,
    selectedList: "Popular",
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

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {});
    player.on("dispose", () => {});
  };

  const { data, isLoading, error, size, setSize } = useSWRInfinite(
    (index) =>
      `https://api.themoviedb.org/3/movie/popular?api_key=${
        process.env.TMDB_API_KEY
      }&language=en-US&page=${index + 1}`,
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
  }, [setSize]);

  useEffect(() => {
    async function fetchData() {
      const movieGenres = await fetchMovieGenres();
      setState((prevState) => ({ ...prevState, genres: movieGenres.genres }));
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      const getVideos =
        state.selectedMovieIndex &&
        (await fetchMovieVideos(movies[state.selectedMovieIndex]?.id));
      setState((prevState) => ({ ...prevState, videos: getVideos?.results }));
    }

    fetchVideos();
  }, [state.selectedMovieIndex]);

  useEffect(() => {
    if (state.videos) {
      const filteredVideos = state.videos?.filter((v) => v.type === "Trailer");
      setVideoJsOptions({
        ...videoJsOptions,
        sources: [
          {
            src: `https://youtube.com/watch?v=${filteredVideos[0]?.key}`,
            type: "video/youtube",
          },
        ],
      });
    }
  }, [state.videos]);

  useEffect(() => {
    loadedPagesRef.current = state.loadedPages;
  }, [state.loadedPages]);

  useEffect(() => {
    moviesRef.current = movies;
  }, [movies]);

  const rows = Array.from(
    { length: Math.ceil(movies.length / state.rowLength) },
    (_, rowIndex) => (
      <div key={`${rowIndex}-${state.rowLength}`}>
        <div className="flex justify-start w-fit mx-auto">
          {movies
            .slice(rowIndex * state.rowLength, (rowIndex + 1) * state.rowLength)
            .map((movie, index) => (
              <div
                key={movie.id}
                className="w-1/2 lg:w-auto cursor-pointer flex"
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    selectedMovieIndex: rowIndex * prevState.rowLength + index,
                  }))
                }
              >
                <div
                  className={`p-4 h-full cursor-pointer ${
                    movies[state.selectedMovieIndex]?.id === movie.id &&
                    "bg-gray-900 border-b-4 border-slate-200 rounded-tl rounded-tr transition ease-in"
                  }`}
                >
                  <MovieItem
                    id={movie.id}
                    poster={movie.poster_path}
                    name={movie.original_title}
                    release={movie.release_date}
                    rating={movie.vote_average}
                  />
                </div>
              </div>
            ))}
        </div>

        {state.selectedMovieIndex !== null &&
          Math.floor(state.selectedMovieIndex / state.rowLength) ===
            rowIndex && (
            <div
              className="relative w-full min-h-[50vh] py-14 xl:py-32 shadow-inner animate-fadeUp transition-all duration-300"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${
                  movies[state.selectedMovieIndex]?.backdrop_path
                })`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
                backgroundAttachment:
                  window?.innerWidth > 500 ? "fixed" : "scroll",
                minHeight: "400px",
                width: "100vw",
              }}
            >
              <div className="absolute w-full h-full bg-black opacity-60 top-0 left-0 shadow-inner" />
              <div className="px-4 lg:px-0 max-w-2xl xl:max-w-6xl h-full mx-auto flex flex-col lg:flex-row items-center">
                <div className="flex flex-col text-white">
                  <h1 className="text-3xl xl:text-5xl uppercase tracking-wider font-semibold w-full lg:w-1/2 z-10">
                    {movies[state.selectedMovieIndex].original_title}
                  </h1>
                  <div className="flex items-center gap-3 mt-3 uppercase text-sm z-10">
                    <p suppressHydrationWarning>
                      {moment(
                        movies[state.selectedMovieIndex].release_date
                      ).format("YYYY")}
                    </p>
                    <p>•</p>
                    <p>
                      {state.genres
                        ?.filter((genre) =>
                          movies[state.selectedMovieIndex]?.genre_ids.some(
                            (movieGenre) => movieGenre === genre.id
                          )
                        )
                        .map((genre) => genre.name)
                        .join(", ")}
                    </p>
                  </div>
                  <p className="mt-6 w-full lg:w-1/2 leading-6 md:leading-7 text-xs md:text-[0.9rem] z-10">
                    {movies[state.selectedMovieIndex].overview}
                  </p>
                  <Link
                    href={`/movie/${movies[state.selectedMovieIndex].id}`}
                    className="mt-8 px-4 py-2 uppercase text-xs tracking-wide rounded-sm bg-[#5937ef] hover:bg-[#6b4aff] text-white font-semibold w-fit cursor-pointer z-10 transition"
                  >
                    Full info
                  </Link>
                </div>
                <div className="text-white w-full lg:w-1/2 flex items-center justify-left lg:justify-center mt-6 lg:mt-0 z-20">
                  <button
                    className="flex flex-row lg:flex-col gap-2 lg:gap-0 items-center"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        showVideo: true,
                      }))
                    }
                  >
                    <PlayIcon />
                    <p className="uppercase font-medium text-sm lg:mt-2 z-10">
                      Play trailer
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    )
  );

  if (error) return <div>Failed to load.</div>;
  if (!data) return <div>Loading...</div>;

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
              <div
                className="relative w-full mx-auto flex jusify-center items-center gap-1 py-6 mb-6 bg-black/50"
                style={{
                  backgroundImage: `url(/images/genres-wallpaper.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment:
                    window?.innerWidth > 500 ? "fixed" : "scroll",
                  minHeight: "300px",
                  width: "100vw",
                }}
              >
                <div className="absolute top-0 left-0 w-screen h-full bg-black/50" />
                <p className="text-white text-5xl font-semibold tracking-wider uppercase mx-auto z-10">
                  <span className="text-[#5937ef] font-black relative bottom-0.5">
                    /
                  </span>{" "}
                  Trending
                </p>
              </div>
              {rows}
              <div className="flex justify-center mx-auto pt-10">
                <button
                  onClick={() => setSize(size + 1)}
                  disabled={isLoading}
                  className="bg-[#5937ef] hover:bg-[#6a49ff] disabled:bg-gray-400 text-white text-xs font-medium px-10 py-2.5 w-fit h-fit rounded-full uppercase transition"
                >
                  {isLoading ? "Loading" : "Show more"}
                </button>
              </div>
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
                  className="absolute top-5 right-5 z-10 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={0.5}
                    stroke="currentColor"
                    className="w-12 h-12 text-gray-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
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

import { useEffect, useState, useRef } from "react";
import { fetchMovieGenres, fetchMovieVideos } from "@api";
import { MovieItem } from "@components/MovieItem";
import { MovieHero } from "@components/MovieHero";
import { Header } from "@components/Header";
import { useHeaderContext } from "@contexts/headerContext";
import { SideMenu } from "@components/SideMenu";
import { Video } from "@components/Video";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import Head from "next/head";
import "video.js/dist/video-js.css";
import "videojs-youtube";

type stateProps = {
  movies: any[];
  genres: any[];
  videos: any[];
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

  useEffect(() => {
    async function fetchData() {
      const movieGenres = await fetchMovieGenres();
      setState((prevState) => ({ ...prevState, genres: movieGenres.genres }));
    }

    fetchData();
  }, []);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {});
    player.on("dispose", () => {});
  };

  const { data, isValidating, error, size, setSize } = useSWRInfinite(
    (index) => `/api/movies?page=${index + 1}`,
    fetcher
  );

  useEffect(() => {
    console.log(isValidating);
  }, [isValidating]);

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
  }, [size]);

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
        <div className="flex justify-start w-fit mx-auto">
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
                }}
              >
                <div
                  className={`p-4 h-full cursor-pointer ${
                    movies[state.selectedMovieIndex!]?.id === movie.id
                      ? "bg-gray-900 border-b-4 border-slate-200 rounded-tl rounded-tr transition ease-in"
                      : "hover:bg-slate-800 rounded transition ease-out duration-300"
                  }`}
                >
                  <MovieItem
                    id={movie.id}
                    poster={movie.poster_path}
                    name={movie.title || movie.name || movie.original_title}
                    release={movie.release_date}
                    genres={state.genres}
                    genreIds={movie.genre_ids}
                    placeholder={movie.placeholder}
                  />
                </div>
              </div>
            ))}
        </div>

        {state.selectedMovieIndex !== null &&
          Math.floor(state.selectedMovieIndex / state.rowLength) ===
            rowIndex && (
            <MovieHero
              movie={movies[state.selectedMovieIndex]}
              genres={state.genres}
              setState={setState}
            />
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
                  disabled={isValidating}
                  className="bg-[#5937ef] hover:bg-[#6a49ff] disabled:bg-[#6a49ff]/40 disabled:text-white/80 text-white text-xs font-medium px-10 py-2.5 w-fit h-fit rounded-full uppercase transition"
                >
                  {isValidating ? "Loading..." : "Show more"}
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

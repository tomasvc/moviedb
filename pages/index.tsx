import { useEffect, useState, useRef } from "react";
import { fetchMovies, fetchMovieGenres, fetchMovieVideos } from "../api";
import { MovieItem } from "../components/MovieItem";
import { Header } from "../components/Header";
import { useHeaderContext } from "../contexts/headerContext";
import { SideMenu } from "../components/SideMenu";
import { PlayIcon } from "../components/Icons";
import { useRouter } from "next/router";
import { Video } from "../components/Video";
import Head from "next/head";
import moment from "moment";
import "video.js/dist/video-js.css";
import "videojs-youtube";

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
  const moviesRef = useRef(state.movies);
  const router = useRouter();
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

    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  useEffect(() => {
    const setRowBasedOnWidth = () => {
      const width = window.innerWidth;
      const rowLength =
        width > 2000 ? 10 : width > 1800 ? 8 : width > 1400 ? 6 : 4;

      setState((prevState) => ({ ...prevState, rowLength }));
    };

    setRowBasedOnWidth();
    window.addEventListener("resize", setRowBasedOnWidth, false);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", setRowBasedOnWidth, false);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      Promise.all([fetchMovies(1), fetchMovies(2)]).then((response) => {
        if (response.length > 0) {
          const data = response.reduce((acc, res) => {
            return { ...acc, results: [...acc.results, ...res.results] };
          });
          const filteredData = [];
          for (let i = 0; i < data.results.length; i++) {
            if (
              !filteredData.some((movie) => movie.id === data.results[i].id)
            ) {
              filteredData.push(data.results[i]);
            }
          }
          setState((prevState) => ({
            ...prevState,
            movies: filteredData,
            loadedPages: 2,
          }));
        }
      });
      const movieGenres = await fetchMovieGenres();
      setState((prevState) => ({ ...prevState, genres: movieGenres.genres }));
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const getVideos =
        state.selectedMovieIndex &&
        (await fetchMovieVideos(state.movies[state.selectedMovieIndex].id));
      setState((prevState) => ({ ...prevState, videos: getVideos?.results }));
    }

    fetchData();
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
    moviesRef.current = state.movies;
  }, [state.movies]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadMoreMovies();
    }
  };

  const loadMoreMovies = async () => {
    const nextPage = loadedPagesRef.current + 1;
    const newMovies = await fetchMovies(nextPage);
    if (newMovies.results.length > 0) {
      const filteredData = newMovies.results.filter(
        (movie) => !moviesRef.current.some((m) => m.id === movie.id)
      );
      setState((prevState) => ({
        ...prevState,
        loadedPages: nextPage,
        movies: [...prevState.movies, ...filteredData],
      }));
    }
  };

  const rows = Array.from(
    { length: Math.ceil(state.movies.length / state.rowLength) },
    (_, rowIndex) => (
      <div key={`${rowIndex}-${state.rowLength}`}>
        <div className="flex justify-start px-20 w-[80%] mx-auto">
          {state.movies
            .slice(rowIndex * state.rowLength, (rowIndex + 1) * state.rowLength)
            .map((movie, index) => (
              <div
                key={movie.id}
                className="cursor-pointer"
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    selectedMovieIndex: rowIndex * prevState.rowLength + index,
                  }))
                }
              >
                <div
                  className={`p-4 h-full cursor-pointer ${
                    state.movies[state.selectedMovieIndex]?.id === movie.id &&
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
                  state.movies[state.selectedMovieIndex]?.backdrop_path
                })`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                minHeight: "400px",
              }}
            >
              <div className="absolute w-full h-full bg-black opacity-40 top-0 left-0 shadow-inner" />
              <div className="max-w-2xl xl:max-w-6xl h-full mx-auto flex items-center">
                <div className="flex flex-col text-white">
                  <h1 className="text-3xl xl:text-5xl uppercase tracking-wider font-semibold w-1/2 z-10">
                    {state.movies[state.selectedMovieIndex].original_title}
                  </h1>
                  <div className="flex items-center gap-3 mt-3 uppercase text-sm z-10">
                    <p>
                      {moment(
                        state.movies[state.selectedMovieIndex].release_date
                      ).format("YYYY")}
                    </p>
                    <p>•</p>
                    <p>
                      {state.genres
                        ?.filter((genre) =>
                          state.movies[
                            state.selectedMovieIndex
                          ]?.genre_ids.some(
                            (movieGenre) => movieGenre === genre.id
                          )
                        )
                        .map((genre) => genre.name)
                        .join(", ")}
                    </p>
                  </div>
                  <p className="mt-6 w-1/2 leading-7 text-[0.9rem] z-10">
                    {state.movies[state.selectedMovieIndex].overview}
                  </p>
                  <button
                    onClick={() =>
                      router.push(
                        `/movie/${state.movies[state.selectedMovieIndex].id}`
                      )
                    }
                    className="mt-8 px-4 py-2 uppercase text-xs tracking-wide rounded-sm bg-[#5937ef] hover:bg-[#6b4aff] text-white font-semibold w-fit cursor-pointer z-10 transition"
                  >
                    Full info
                  </button>
                </div>
                <div className="text-white w-1/2 flex flex-col items-center justify-center z-20">
                  <button
                    className="flex flex-col items-center"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        showVideo: true,
                      }))
                    }
                  >
                    <PlayIcon />
                    <p className="uppercase font-medium text-sm mt-2 z-10">
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

  return (
    <div className="bg-[#192231] font-roboto">
      <Head>
        <title>Movies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex bg-[#192231] w-full min-h-screen lg:mx-auto transition-all">
        <SideMenu selected="home" />
        <div className="w-full relative">
          <Header open={open} setOpen={setOpen} />
          <div className="my-20 animate-fadeUp flex flex-col justify-center mx-auto">
            {/* <div className="max-w-[1790px] w-full mx-auto flex gap-1 pb-6">
              <button className="w-1/4 text-white bg-gray-900 uppercase">
                Popular
              </button>
              <button className="w-1/4 h-20 text-white bg-gray-900 uppercase">
                Top Rated
              </button>
              <button className="w-1/4 h-20 text-white bg-gray-900 uppercase">
                Upcoming
              </button>
              <button className="w-1/4 h-20 text-white bg-gray-900 uppercase">
                Now Playing
              </button>
            </div> */}
            {rows}
          </div>
          {state.showVideo && (
            <div className="fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-sm flex justify-center items-center w-full h-screen">
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

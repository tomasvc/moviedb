import moment from "moment";
import Link from "next/link";
import { PlayIcon } from "@components/Icons";

export const HomeMovieHero = ({
  movie,
  genres,
  setState,
  videoAvailable,
}: {
  movie: Record<string, any>;
  genres: Record<string, any>[];
  setState: (fn: (prevState: any) => any) => void;
  videoAvailable: boolean;
}) => {
  return (
    <div
      id={`hero-${movie.id}`}
      className="relative w-full min-h-[30vh] py-14 xl:py-32 shadow-inner transition-all duration-300 animate-fadeIn rounded-md mt-2 border border-slate-700/80 overflow-hidden"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: window?.innerWidth > 500 ? "fixed" : "scroll",
      }}
    >
      <div className="absolute w-full h-full bg-black opacity-60 top-0 left-0 shadow-inner" />
      <div className="px-4 lg:px-0 max-w-2xl xl:max-w-6xl h-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 lg:items-start">
        <div className="flex flex-col text-white min-w-0 z-10">
          <h1 className="text-xl sm:text-3xl xl:text-5xl uppercase tracking-wider font-semibold w-full z-10">
            {movie.title || movie.name || movie.original_title}
          </h1>
          <div className="flex items-center gap-2 mt-3 uppercase text-xs sm:text-sm z-10">
            <p
              className="text-[#adff4f] font-bold uppercase tracking-wider"
              suppressHydrationWarning
            >
              {moment(movie.release_date).format("YYYY")}
            </p>
            <p>•</p>
            <p>
              {genres
                .filter((genre: any) =>
                  movie.genre_ids?.some(
                    (movieGenre: number) => movieGenre === genre.id,
                  ),
                )
                .map((genre) => genre.name)
                .join(", ")}
            </p>
          </div>
          <p className="mt-6 max-w-[600px] w-full leading-6 md:leading-7 text-xs md:text-[0.9rem] z-10">
            {movie.overview}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 z-10">
            <Link
              href={`/movie/${movie.id}`}
              prefetch={false}
              className="px-4 py-2 uppercase text-xs tracking-wide rounded-md bg-[#5937ef] hover:bg-[#6b4aff] text-white font-semibold w-fit cursor-pointer transition"
            >
              Full info
            </Link>
            {videoAvailable && (
              <button
                type="button"
                onClick={() =>
                  setState((prevState: any) => ({
                    ...prevState,
                    showVideo: true,
                  }))
                }
                className="lg:hidden flex items-center gap-2 rounded-md bg-[#5937ef]/90 px-4 py-2.5 text-white font-semibold uppercase tracking-wide text-xs transition hover:bg-[#6b4aff] min-h-[44px]"
              >
                <PlayIcon />
                <span className="uppercase font-medium tracking-wide text-xs whitespace-nowrap">
                  Play trailer
                </span>
              </button>
            )}
          </div>
        </div>
        {videoAvailable && (
          <div className="hidden lg:flex items-center justify-end self-stretch w-full">
            <button
              type="button"
              onClick={() =>
                setState((prevState: any) => ({
                  ...prevState,
                  showVideo: true,
                }))
              }
              className="group flex-shrink-0 w-[320px] h-[180px] flex flex-col items-center justify-center gap-2 z-20 text-white bg-[#5937ef]/20 backdrop-blur-sm border border-[#5937ef]/40 rounded-md hover:bg-[#5937ef]/35 hover:border-[#6b4aff]/60 hover:scale-[1.02] transition-all duration-300 ease-out shadow-lg shadow-purple-950/30"
            >
              <PlayIcon />
              <p className="uppercase font-medium tracking-wide text-sm whitespace-nowrap">
                Play trailer
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

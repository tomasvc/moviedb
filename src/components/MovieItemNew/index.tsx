import moment from "moment";
import Image from "next/image";

export const MovieItem = ({
  movie,
  genres,
  isSelected,
}: {
  movie: Record<string, any>;
  genres?: Record<string, any>[];
  genreIds?: number[];
  placeholder?: string;
  isSelected?: boolean;
}) => {
  return (
    <div
      id={`movie-${movie?.id}`}
      className="relative flex flex-col cursor-pointer text-white animate-fadeUp"
    >
      <div className="relative rounded overflow-hidden shadow-xl group-hover:scale-105 transition-all duration-300">
        {movie?.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w400${movie?.poster_path}`}
            alt={movie?.title || movie?.name || movie?.original_title}
            className="w-full h-auto aspect-[2/3] object-cover rounded border border-slate-700/30"
            width={400}
            height={400}
            priority
          />
        ) : (
          <div
            style={{ width: 400, height: 600, backgroundColor: "#fafafa20" }}
            className="animate-pulse"
          />
        )}
        <div
          className={`absolute inset-0 rounded pointer-events-none transition-opacity duration-300 ease-out bg-[radial-gradient(ellipse_110%_80%_at_0%_0%,rgba(89,55,239,0.38)_0%,rgba(89,55,239,0.14)_35%,transparent_72%),radial-gradient(ellipse_110%_80%_at_100%_0%,rgba(89,55,239,0.38)_0%,rgba(89,55,239,0.14)_35%,transparent_72%),radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_18%,rgba(89,55,239,0.18)_48%,rgba(89,55,239,0.48)_82%,rgba(89,55,239,0.62)_100%)] ${
            isSelected ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
      </div>

      <div
        className={`absolute bottom-0 left-0 flex flex-col justify-end p-4 w-full h-full bg-gradient-to-b from-black/0 to-black/70 hover:opacity-100 transition-opacity duration-300 rounded ${
          isSelected ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`absolute bottom-0 left-0 w-full h-1.5 bg-slate-200 ease-out transition-transform duration-200 ${
            isSelected ? "scale-x-100" : "scale-x-0"
          }`}
        ></div>
        <div className="flex gap-1 overflow-hidden text-white text-sm mt-1">
          <span>
            {moment(movie?.release_date).format("YYYY")}
            {genres && movie?.genre_ids && <span className="pl-1">⋅</span>}
          </span>
          <span className="truncate max-w-[60%] sm:max-w-[100%]">
            {genres &&
              movie?.genre_ids &&
              genres
                .filter((genre: any) => movie?.genre_ids.includes(genre.id))
                .map((genre: any) => genre?.name)
                .join("/")}
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-bold line-clamp-2 mb-2">
          {movie?.title || movie?.name || movie?.original_title}
        </p>
      </div>
    </div>
  );
};

import moment from "moment";
import Image from "next/image";

export const MovieItem = ({
  movie,
  genres,
}: {
  movie: any;
  genres?: any;
  genreIds?: number[];
  placeholder?: string;
}) => {
  return (
    <div
      id={`movie-${movie.id}`}
      className="relative flex flex-col rounded-sm cursor-pointer text-white animate-fadeUp"
    >
      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          alt={movie.title || movie.name || movie.original_title}
          className="rounded-sm shadow-xl"
          width={180}
          height={270}
          // placeholder="blur"
          // blurDataURL={movie.placeholder ?? ""}
          priority
        />
      ) : (
        <div
          style={{ width: 180, height: 270, backgroundColor: "#fafafa20" }}
          className="rounded-md shadow-xl animate-pulse"
        />
      )}

      <div className="mt-3 mr-1 text-left">
        <div className="flex gap-1 overflow-hidden w-[180px] text-slate-400 text-xs mt-1">
          <span>
            {moment(movie.release_date).format("YYYY")}
            {genres && movie.genre_ids && <span className="pl-1">⋅</span>}
          </span>
          <span className="truncate max-w-[60%] sm:max-w-[100%]">
            {genres &&
              movie.genre_ids &&
              genres
                .filter((genre: any) => movie.genre_ids.includes(genre.id))
                .map((genre: any) => genre?.name)
                .join("/")}
          </span>
        </div>
        <p className="text-sm leading-6 max-w-[180px] truncate">
          {movie.title || movie.name || movie.original_title}
        </p>
      </div>
    </div>
  );
};

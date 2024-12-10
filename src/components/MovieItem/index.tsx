import moment from "moment";
import Image from "next/image";

export const MovieItem = ({
  id,
  poster,
  name,
  release,
  genres,
  genreIds,
  placeholder,
}: {
  id: number;
  poster: string;
  name: string;
  release: string;
  genres?: any;
  genreIds?: number[];
  placeholder?: string;
}) => {
  return (
    <div className="relative flex flex-col rounded-sm cursor-pointer text-white animate-fadeUp">
      {poster ? (
        <Image
          src={`https://image.tmdb.org/t/p/w400${poster}`}
          alt={name}
          className="rounded-sm shadow-xl"
          width={180}
          height={270}
          // placeholder="blur"
          // blurDataURL={placeholder ?? ""}
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
            {moment(release).format("YYYY")}
            {genres && genreIds && <span className="pl-1">⋅</span>}
          </span>
          <span className="truncate">
            {genres &&
              genreIds &&
              genres
                .filter((genre: any) => genreIds.includes(genre.id))
                .map((genre: any) => genre?.name)
                .join("/")}
          </span>
        </div>
        <p className="text-sm leading-6 max-w-[180px] truncate">{name}</p>
      </div>
    </div>
  );
};

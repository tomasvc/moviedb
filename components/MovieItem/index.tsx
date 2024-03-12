import React from "react";
import { useRouter } from "next/router";
import moment from "moment";
import Image from "next/image";

type MovieItemProps = {
  id: number;
  poster: string;
  name: string;
  release: string;
  rating: string;
};

export const MovieItem: React.FC<MovieItemProps> = ({
  id,
  poster,
  name,
  release,
}) => {
  const router = useRouter();
  return (
    <div className="relative flex flex-col w-[150px] rounded-sm cursor-pointer text-white">
      <Image
        src={`https://image.tmdb.org/t/p/w400${poster}`}
        alt={name}
        className="max-w-[150px] rounded-md shadow-xl"
        width={500}
        height={300}
      />
      <div className="mt-3 mr-1 text-left">
        <p className="font-medium text-sm leading-5 uppercase tracking-wide">
          {name}
        </p>
        <p className="text-xs mt-1 font-light">
          {moment(release).format("YYYY")}
        </p>
      </div>
    </div>
  );
};

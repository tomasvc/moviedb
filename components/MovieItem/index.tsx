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
  poster,
  name,
  release,
}) => {
  const router = useRouter();
  return (
    <div className="relative flex flex-col w-full max-w-[180px] rounded-sm cursor-pointer text-white">
      <Image
        src={`https://image.tmdb.org/t/p/w400${poster}`}
        alt={name}
        className="max-w-[180px] w-full rounded-md shadow-xl"
        width={500}
        height={300}
        priority
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

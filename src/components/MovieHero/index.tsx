"use client";
import moment from "moment";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { PlayIcon } from "@components/Icons";
type MovieItemProps = {
  id: number;
  poster: string;
  name: string;
  release: string;
  rating: string;
};

export const MovieHero = ({ movie, genres, setState }) => {
  const [plaiceholder, setPlaiceholder] = useState<{ base64: string } | null>(
    null
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  //   useEffect(() => {
  //     const fetchPlaiceholder = async () => {
  //       if (poster) {
  //         try {
  //           cons  t response = await fetch(
  //             `/api/getPlaceholder?poster=${
  //               "https://image.tmdb.org/t/p/w400" + poster
  //             }`
  //           );
  //           const plaiceholderData = await response.json();
  //           setPlaiceholder(plaiceholderData);
  //         } catch (error) {
  //           console.error("Failed to fetch placeholder:", error);
  //         }
  //       }
  //     };

  //     fetchPlaiceholder();
  //   }, [poster]);

  return (
    <div
      className="relative w-full min-h-[50vh] py-14 xl:py-32 shadow-inner transition-all duration-300 animate-fadeIn"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: window?.innerWidth > 500 ? "fixed" : "scroll",
        minHeight: "400px",
        width: "100vw",
      }}
    >
      <div className="absolute w-full h-full bg-black opacity-60 top-0 left-0 shadow-inner" />
      <div className="px-4 lg:px-0 max-w-2xl xl:max-w-6xl h-full mx-auto flex flex-col lg:flex-row items-center">
        <div className="flex flex-col text-white">
          <h1 className="text-3xl xl:text-5xl uppercase tracking-wider font-semibold w-full lg:w-1/2 z-10">
            {movie.title || movie.name || movie.original_title}
          </h1>
          <div className="flex items-center gap-3 mt-3 uppercase text-sm z-10">
            <p suppressHydrationWarning>
              {moment(movie.release_date).format("YYYY")}
            </p>
            <p>•</p>
            <p>
              {genres
                .filter((genre) =>
                  movie.genre_ids.some(
                    (movieGenre: any) => movieGenre === genre.id
                  )
                )
                .map((genre) => genre.name)
                .join(", ")}
            </p>
          </div>
          <p className="mt-6 w-full lg:w-1/2 leading-6 md:leading-7 text-xs md:text-[0.9rem] z-10">
            {movie.overview}
          </p>
          <Link
            href={`/movie/${movie.id}`}
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
  );
};

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieReviews,
  fetchMovieKeywords,
  fetchRecommendedMovies,
  fetchMovieImages,
  fetchMovieVideos,
} from "../../pages/api";
import { Header } from "../../components/Header";
import { MovieItem } from "../../components/MovieItem";
import { useHeaderContext } from "../../contexts/headerContext";
import { StarIcon, UserIcon } from "../../components/Icons";
import { Genre } from "./types";
import clsx from "clsx";
import moment from "moment";

export const Movie = ({ movie, credits, reviews, keywords, similar }) => {
  const router = useRouter();
  const { open, setOpen } = useHeaderContext();

  const findCreditsByKeyword = (credits: any, keyword: string) => {
    return (
      credits?.crew?.filter((item: any) => item.job === keyword).length > 0
    );
  };

  return (
    <div className="bg-[#192231]-50 overflow-x-hidden">
      <Header open={open} setOpen={setOpen} transparent />
      <main
        className={clsx("bg-[#192231] w-full mx-4 lg:mx-auto transition-all", {
          "blur-md": open,
        })}
      >
        <div
          className="relative w-screen transition-all"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: `center`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            maxHeight: "800px",
            height: "100%",
          }}
        >
          <div className="absolute bg-black/70 z-20 w-full h-full" />
          <div className="relative flex flex-col lg:flex-row gap-2 z-30 w-full lg:w-2/3 mx-auto py-24">
            <div className="rounded-md w-full lg:w-1/3 h-auto">
              <img
                className="rounded-md w-auto h-auto ml-auto"
                src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
              />
            </div>
            <div className="ml-10 my-4 text-white w-full lg:w-2/3 flex flex-col justify-between">
              <div>
                <h1 className="text-white font-semibold text-5xl whitespace-nowrap flex items-center gap-4">
                  {movie?.title || movie?.name || movie?.original_title}
                </h1>
                <div className="flex gap-4 mt-2 uppercase font-bold tracking-wider">
                  <p className="text-[#adff4f] font-bold uppercase tracking-wider pb-1">
                    {moment(movie?.release_date).format("YYYY")}
                  </p>
                  <div className="flex">
                    {movie?.genres?.map((genre: Genre, index: number) => {
                      return (
                        <p key={genre.id}>
                          {index !== 0 && (
                            <span className="font-light pl-1 pr-2">|</span>
                          )}
                          {genre?.name}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <h2 className="mt-8 2xl:text-xl italic text-slate-300">
                  {movie?.tagline}
                </h2>
                <p className="mt-4 font-light leading-7">{movie?.overview}</p>
              </div>
              <div className="text-white flex flex-col gap-4 mt-6">
                {findCreditsByKeyword(credits, "Director") && (
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider">
                      Director
                    </p>
                    <div className="flex gap-1 font-light">
                      {credits?.crew
                        ?.filter((item) => item.job === "Director")
                        ?.map((item, index) => {
                          return (
                            <button
                              onClick={() => router.push(`/person/${item.id}`)}
                              key={index}
                              className="whitespace-nowrap"
                            >
                              {index !== 0 && (
                                <span className="font-bold pl-1.5 pr-2.5">
                                  ·
                                </span>
                              )}
                              {item.name}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {findCreditsByKeyword(credits, "Executive Producer") && (
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider">
                      Producers
                    </p>
                    <div className="flex gap-1 font-light">
                      {credits?.crew
                        ?.filter((item) => item.job === "Executive Producer")
                        ?.map((item, index) => {
                          return (
                            <button
                              onClick={() => router.push(`/person/${item.id}`)}
                              key={index}
                              className="whitespace-nowrap"
                            >
                              {index !== 0 && (
                                <span className="font-bold pl-1.5 pr-2.5">
                                  ·
                                </span>
                              )}
                              {item.name}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {findCreditsByKeyword(credits, "Screenplay") && (
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider">
                      Screenplay
                    </p>
                    <div className="flex gap-1 font-light">
                      {credits?.crew
                        ?.filter((item) => item.job === "Screenplay")
                        ?.map((item, index) => {
                          return (
                            <button
                              onClick={() => router.push(`/person/${item.id}`)}
                              key={index}
                              className="whitespace-nowrap"
                            >
                              {index !== 0 && (
                                <span className="font-bold pl-1.5 pr-2.5">
                                  ·
                                </span>
                              )}
                              {item.name}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full 2xl:w-2/3 mx-auto px-10 pl-24 flex flex-col-reverse lg:flex-row text-white">
          <div className="w-full lg:w-3/4 divide-y divide-slate-600">
            <div className="w-full mx-auto 2xl:mx-0 py-8">
              <div className="flex gap-3">
                <div className="w-1.5 h-7 bg-blue-400" />
                <h2 className="text-lg font-medium mb-4 tracking-wide uppercase">
                  Top Billed Cast
                </h2>
              </div>

              <div className="flex gap-4 overflow-auto p-4">
                {credits?.cast?.slice(0, 10).map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => router.push(`/person/${item.id}`)}
                      className="bg-[#263146] shadow-lg rounded-md cursor-pointer"
                    >
                      <div className="w-40">
                        <img
                          className="w-full rounded-t-md"
                          src={`https://image.tmdb.org/t/p/w400${item.profile_path}`}
                        />
                      </div>
                      <div className="m-2">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm">{item.character}</p>
                      </div>
                    </div>
                  );
                })}
                <button className="bg-[#263146] whitespace-nowrap font-bold p-10 flex justify-center items-center shadow-lg rounded-md">
                  View more
                </button>
              </div>
              <button className="font-medium text-lg mt-2">
                Full Cast & Crew
              </button>
            </div>
            {reviews?.length > 0 && (
              <div className="w-full mx-auto py-8">
                <div className="flex gap-3 items-center">
                  <div className="w-1.5 h-7 bg-blue-400" />
                  <h2 className="text-lg font-medium uppercase mr-4 tracking-wide">
                    Social
                  </h2>
                  <button className="font-semibold mt-1.5 pb-1 border-b-4 border-slate-600">
                    Reviews {reviews?.length}
                  </button>
                  <button className="font-semibold mb-1 ml-2">
                    Discussions
                  </button>
                </div>
                <div className="bg-[#263146] shadow-md border border-slate-600 p-8 mt-8 rounded-lg">
                  <div className="flex w-full">
                    {reviews[0]?.author_details?.avatar_path?.length ? (
                      <img
                        className="rounded-full w-16 h-16"
                        src={
                          reviews[0]?.author_details?.avatar_path?.includes(
                            "https"
                          )
                            ? reviews[0]?.author_details?.avatar_path?.slice(1)
                            : `https://image.tmdb.org/t/p/w400${reviews[0]?.author_details?.avatar_path}`
                        }
                      />
                    ) : (
                      <UserIcon />
                    )}

                    <div className="ml-6 mb-auto flex flex-col">
                      <div className="flex items-center">
                        <p className="text-xl font-bold">
                          A review by {reviews[0]?.author}
                        </p>
                        <div className="flex items-center gap-1 bg-black text-sm font-light h-fit px-2.5 rounded-md ml-2">
                          <StarIcon />
                          <p>{reviews[0]?.author_details?.rating}</p>
                        </div>
                      </div>
                      <p className="text-sm font-light text-gray-400">
                        Written by {reviews[0]?.author} on{" "}
                        {moment(reviews[0]?.created_at).format("MMMM d, YYYY")}
                      </p>
                      <div
                        className="mt-8"
                        dangerouslySetInnerHTML={{
                          __html: reviews[0]?.content.replace(
                            /(?:\r\n|\r|\n)/g,
                            "<br>"
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <button className="font-medium text-lg mt-4">
                  Read All Reviews
                </button>
              </div>
            )}
            <div className="relative w-full mx-auto py-10">
              <div className="flex gap-3 mb-2">
                <div className="w-1.5 h-7 bg-blue-400" />
                <h2 className="text-lg font-medium mb-4 tracking-wide uppercase">
                  Recommendations
                </h2>
              </div>
              <div className="flex overflow-scroll gap-5">
                {similar?.results?.map((item, index) => {
                  return (
                    <Link href={`/movie/${item.id}`}>
                      <MovieItem
                        key={index}
                        id={item.id}
                        poster={item.poster_path}
                        name={item.original_title}
                        release={item.release_date}
                        rating={item.rating}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4 py-8 px-10">
            <div className="text-sm flex flex-row lg:flex-col gap-4">
              <div>
                <label className="font-semibold">Status</label>
                <p>{movie?.status}</p>
              </div>
              <div>
                <label className="font-semibold">Original language</label>
                <p>{movie?.spoken_languages[0]?.name}</p>
              </div>
              <div>
                <label className="font-semibold">Budget</label>
                <p>${movie?.budget.toLocaleString()}</p>
              </div>
              <div>
                <label className="font-semibold">Revenue</label>
                <p>${movie?.revenue.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <div className="flex gap-3 mt-8 mb-2">
                <div className="w-1.5 h-7 bg-blue-400" />
                <p className="text-lg font-medium uppercase tracking-wide mb-2">
                  Keywords
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords?.keywords?.map((item, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(`/keyword/${item.id}`)}
                      className="bg-[#263146] text-sm rounded border border-slate-600 text-slate-200 w-fit px-2 py-1"
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

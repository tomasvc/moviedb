import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieReviews,
  fetchMovieKeywords,
  fetchRecommendedMovies,
} from "../../api";
import { useState, useEffect, Suspense } from "react";
import { SideMenu } from "../../components/SideMenu";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../../components/Header";
import { MovieItem } from "../../components/MovieItem";
import { useHeaderContext } from "../../contexts/headerContext";
import { TrophyIconMini } from "../../components/Icons";
import { CircularProgress } from "@mui/material";
import OpenAI from "openai";
import clsx from "clsx";
import moment from "moment";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Review } from "./_components/Review";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const movie = await fetchMovieDetails(id as string);
  const credits = await fetchMovieCredits(id as string);
  const reviews = await fetchMovieReviews(id as string);
  const keywords = await fetchMovieKeywords(id as string);
  const recommendations = await fetchRecommendedMovies(id as string);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Has this movie won any Academy Awards - ${
          movie.title || movie.name || movie.original_title
        }. Only give a 'Yes' or 'No' answer even if you don't know.`,
      },
    ],
    model: "gpt-4-0125-preview",
  });

  const awards = response.choices[0].message.content?.toLowerCase() ?? "";

  return {
    props: { movie, credits, reviews, keywords, recommendations, awards },
  };
};

export default function Movie({
  movie,
  credits,
  reviews,
  keywords,
  recommendations,
  awards,
}: {
  movie: any;
  credits: any;
  reviews: any;
  keywords: any;
  recommendations: any;
  awards: any;
}) {
  const router = useRouter();

  console.log(movie);
  console.log(credits);

  const { open, setOpen } = useHeaderContext();
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    setIsFixed(window?.innerWidth > 500);
  }, []);

  const backgroundAttachment = isFixed ? "fixed" : "scroll";

  const findCreditsByKeyword = (credits: any, keyword: string) => {
    return (
      credits?.crew?.filter((item: any) => item.job === keyword).length > 0
    );
  };

  if (movie && credits && keywords) {
    return (
      <Suspense fallback={<Loading />}>
        <div
          className="bg-[#192231]-50 overflow-x-hidden animate-fadeIn"
          suppressHydrationWarning
        >
          <Head>
            <title>
              {movie?.title || movie?.name || movie?.original_title}
            </title>
            <meta name="description" content={movie?.overview.slice(0, 150)} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header open={open} setOpen={setOpen} />
          <SideMenu />
          <main
            className={clsx(
              "bg-[#192231] w-full mx-auto transition-all animate-fadeUp",
              {
                "blur-md": open,
              }
            )}
          >
            <div
              className="relative w-screen transition-all"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundAttachment,
                animation: "none",
                height: "fit-content",
                width: "100vw",
              }}
            >
              <div className="absolute bg-black/70 z-20 w-full h-full" />
              <div className="relative flex flex-col lg:flex-row gap-2 z-30 w-full lg:w-2/3 mx-auto pt-24 pb-12">
                <div className="rounded-md w-1/2 lg:w-1/3 h-auto mx-auto">
                  <img
                    className="rounded-md w-auto h-auto xl:ml-auto"
                    src={`https://image.tmdb.org/t/p/w400${movie?.poster_path}`}
                  />
                </div>
                <div className="px-4 xl:pl-10 my-4 text-white w-full lg:w-2/3 flex flex-col justify-between">
                  <div>
                    <h1 className="text-white font-semibold text-3xl lg:text-5xl flex items-center gap-4">
                      {movie?.title || movie?.name || movie?.original_title}
                    </h1>
                    <div className="flex gap-4 mt-2 uppercase font-bold tracking-wider text-sm">
                      <p
                        className="text-[#adff4f] font-bold uppercase tracking-wider pb-1"
                        suppressHydrationWarning
                      >
                        {moment(movie?.release_date).format("YYYY")}
                      </p>
                      <div className="flex flex-wrap">
                        {movie?.genres?.map(
                          (genre: any, index: number, array) => {
                            const isLastItem = index === array.length - 1;
                            return (
                              <p key={genre.id} className="font-semibold">
                                {genre?.name}
                                {!isLastItem && (
                                  <span className="font-light px-2">|</span>
                                )}
                              </p>
                            );
                          }
                        )}
                      </div>
                    </div>
                    {awards.includes("yes") && (
                      <div className="flex items-center gap-2 mt-1">
                        <TrophyIconMini />
                        <p className="tracking-wider uppercase font-semibold text-xs mt-0.5 text-[#c3bf44]">
                          Academy Award&reg; Winner
                        </p>
                      </div>
                    )}
                    <h2 className="mt-4 2xl:text-xl italic text-slate-300">
                      {movie?.tagline}
                    </h2>
                    <p className="mt-4 font-light leading-6 lg:leading-7 text-sm lg:text-base">
                      {movie?.overview}
                    </p>
                  </div>
                  <div className="text-white flex flex-col gap-4 mt-6">
                    {findCreditsByKeyword(credits, "Director") && (
                      <div>
                        <p className="font-bold text-xs lg:text-sm uppercase tracking-wider">
                          Director
                        </p>
                        <div className="flex gap-2 font-light">
                          {credits?.crew
                            ?.filter((item) => item.job === "Director")
                            ?.map((item, index, array) => {
                              const isLastItem = index === array.length - 1;
                              return (
                                <button
                                  onClick={() =>
                                    router.push(`/person/${item.id}`)
                                  }
                                  key={index}
                                  className="whitespace-nowrap text-sm lg:text-base"
                                >
                                  {!isLastItem && <span>,</span>}
                                  {item.name}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {findCreditsByKeyword(credits, "Producer") && (
                      <div>
                        <p className="font-bold text-xs lg:text-sm uppercase tracking-wider">
                          Producers
                        </p>
                        <div className="flex flex-wrap gap-2 font-light">
                          {credits?.crew
                            ?.filter((item) => item.job === "Producer")
                            ?.slice(0, 4)
                            .map((item, index, array) => {
                              const isLastItem = index === array.length - 1;
                              return (
                                <button
                                  onClick={() =>
                                    router.push(`/person/${item.id}`)
                                  }
                                  key={index}
                                  className="whitespace-nowrap text-sm lg:text-base"
                                >
                                  {item.name}
                                  {!isLastItem && <span>,</span>}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {findCreditsByKeyword(credits, "Screenplay") && (
                      <div>
                        <p className="font-bold text-xs lg:text-sm uppercase tracking-wider">
                          Screenplay
                        </p>
                        <div className="flex gap-2 font-light">
                          {credits?.crew
                            ?.filter((item) => item.job === "Screenplay")
                            ?.slice(0, 4)
                            ?.map((item, index, array) => {
                              const isLastItem = index === array.length - 1;
                              return (
                                <button
                                  onClick={() =>
                                    router.push(`/person/${item.id}`)
                                  }
                                  key={index}
                                  className="whitespace-nowrap text-sm lg:text-base"
                                >
                                  {item.name}
                                  {!isLastItem && <span>,</span>}
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

            <div className="w-full 2xl:w-2/3 mx-auto px-0 xl:px-10 xl:pl-24 2xl:pl-0 flex flex-col-reverse lg:flex-row text-white">
              <div className="w-full lg:w-3/4 px-4 xl:px-0 divide-y divide-slate-600">
                <div className="w-full mx-auto 2xl:mx-0 py-8">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-7 bg-blue-400" />
                    <h2 className="text-lg font-medium mb-4 tracking-wide uppercase">
                      Top Billed Cast
                    </h2>
                  </div>

                  <div className="flex gap-2 xl:gap-4 overflow-auto py-4">
                    {credits?.cast?.slice(0, 10).map((item, index) => {
                      return (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          onClick={() => router.push(`/person/${item.id}`)}
                          className="bg-[#263146] shadow-lg rounded-md cursor-pointer"
                        >
                          <div className="w-20 xl:w-40">
                            <img
                              className="w-full rounded-t-md"
                              src={`https://image.tmdb.org/t/p/w400${item.profile_path}`}
                            />
                          </div>
                          <div className="m-2 text-xs xl:text-base">
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs xl:text-sm">
                              {item.character}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {/* <button className="bg-[#263146] whitespace-nowrap font-bold p-10 flex justify-center items-center shadow-lg rounded-md">
                        View more
                      </button> */}
                  </div>
                  {/* <button className="font-medium text-lg mt-2">
                      Full Cast & Crew
                    </button> */}
                </div>
                {reviews?.results?.length > 0 && (
                  <div className="w-full mx-auto py-8">
                    <div className="flex gap-3 items-center mb-4">
                      <div className="w-1.5 h-7 bg-blue-400" />
                      <h2 className="text-lg font-medium uppercase mr-4 tracking-wide">
                        Social
                      </h2>
                      <button className="font-semibold mt-1.5 pb-1 border-b-4 border-slate-600">
                        Reviews {reviews?.results?.length}
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {reviews?.results.map((review, index) => {
                        return (
                          <Review review={review} index={index} key={index} />
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="relative w-full mx-auto py-10">
                  <div className="flex gap-3 mb-2">
                    <div className="w-1.5 h-7 bg-blue-400" />
                    <h2 className="text-lg font-medium mb-4 tracking-wide uppercase">
                      Recommendations
                    </h2>
                  </div>
                  <div className="flex overflow-x-scroll gap-5">
                    {recommendations?.results?.map(
                      (item: any, index: number) => {
                        return (
                          <Link
                            href={`/movie/${item.id}`}
                            className="min-w-[150px]"
                            key={index}
                          >
                            <MovieItem movie={item} />
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/4 py-8 px-4 xl:px-10">
                <div className="text-sm grid grid-cols-2 lg:flex flex-row lg:flex-col gap-4">
                  <div>
                    <label className="font-semibold">Status</label>
                    <p>{movie?.status}</p>
                  </div>
                  <div>
                    <label className="font-semibold">Original language</label>
                    <p>{movie?.spoken_languages[0]?.name}</p>
                  </div>
                  {movie?.runtime && movie?.runtime > 0 && (
                    <div>
                      <label className="font-semibold">Runtime</label>
                      <p>
                        {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}
                        m
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="font-semibold">Budget</label>
                    <p>
                      {movie?.budget && movie?.budget > 0
                        ? `$${movie?.budget.toLocaleString()}`
                        : "Not available"}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold">Revenue</label>
                    <p>
                      {movie?.revenue && movie?.revenue > 0
                        ? `$${movie?.revenue.toLocaleString()}`
                        : "Not available"}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold">
                      Production companies
                    </label>
                    <div className="flex flex-row flex-wrap gap-2 mt-2">
                      {movie?.production_companies?.map(
                        (item: any, index: number) => {
                          if (!item.logo_path) {
                            return null;
                          }
                          return (
                            <div
                              key={index}
                              className="flex flex-col justify-center items-center w-fit h-max bg-white rounded"
                            >
                              <div className="w-16 h-auto p-1.5">
                                <img
                                  className="w-full h-full object-cover"
                                  src={`https://image.tmdb.org/t/p/w200${item.logo_path}`}
                                  alt={item.name}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
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
                    {keywords?.keywords?.map((item: any, index: number) => {
                      return (
                        <button
                          key={index}
                          onClick={() => router.push(`/keyword/${item.id}`)}
                          className="bg-[#263146] text-xs xl:text-sm rounded border border-slate-600 text-slate-200 w-fit px-2 py-1"
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
      </Suspense>
    );
  }
}

const Loading = () => {
  return (
    <div className="bg-[#192231]-50 overflow-x-hidden" suppressHydrationWarning>
      <Header open={false} setOpen={() => {}} />
      <SideMenu />
      <main
        className={clsx(
          "bg-[#192231] w-full mx-auto transition-all animate-fadeUp",
          {
            "blur-md": false,
          }
        )}
      >
        <div className="w-full h-screen flex items-center justify-center">
          <CircularProgress className="text-blue-400 w-32 h-32" />
        </div>
      </main>
    </div>
  );
};

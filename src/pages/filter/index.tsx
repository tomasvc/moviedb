import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { fetchDiscover } from "../../api";
import { SideMenu } from "../../components/SideMenu";
import { FilterMenu } from "../../components/FilterMenu";
import { Header } from "../../components/Header";
import { useHeaderContext } from "../../contexts/headerContext";
import { MovieItem } from "../../components/MovieItem";
import { XIcon } from "../../components/Icons";

export default function Filter() {
  const { open, setOpen } = useHeaderContext();
  const [isClient, setIsClient] = useState(false);
  const [results, setResults] = useState<any>();
  const [genres, setGenres] = useState<any>([]);
  const [rating, setRating] = useState<any>([]);
  const [releaseYearFilterType, setReleaseYearFilterType] = useState("range");
  const [releaseYear, setReleaseYear] = useState<any>([]);
  const [country, setCountry] = useState<any>(null);
  const [voteAverage, setVoteAverage] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState<number | null>(null);

  const countryCodes = {
    Australia: "AU",
    Canada: "CA",
    France: "FR",
    Germany: "DE",
    Italy: "IT",
    Japan: "JP",
    "New Zealand": "NZ",
    "United Kingdom": "GB",
    "United States": "US",
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDiscover(
        genres,
        country && countryCodes[country],
        releaseYear!
      );
      setResults(data);
    };
    fetchData();
  }, [genres, country, releaseYear]);

  const handleFilterClick = () => {
    const newArr = genres.map((item) => {
      if (item.selected) {
        return { ...item, selected: false };
      } else return item;
    });

    setGenres(newArr);
  };

  if (isClient)
    return (
      <div className="bg-[#192231] font-roboto">
        <Head>
          <title>Movies</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header open={open} setOpen={setOpen} />
        <main className="relative flex bg-[#192231] w-full min-h-screen lg:mx-auto transition-all">
          <SideMenu selected="filter" />
          <div className="overflow-y-auto">
            <FilterMenu
              genres={genres}
              country={country}
              setGenres={setGenres}
              setCountry={setCountry}
              setReleaseYearFilterType={setReleaseYearFilterType}
              setReleaseYear={setReleaseYear}
              setVoteAverage={setVoteAverage}
              setVoteCount={setVoteCount}
            />
          </div>
          <div className="w-[80%] ml-auto mt-16 p-8">
            <div className="flex items-center gap-4 w-full text-sm animate-fadeUp">
              {results && (
                <p className="text-[#adff4f] uppercase tracking-wider py-2">
                  {results.total_results.toLocaleString()} movies
                </p>
              )}
              {genres && genres.some((item) => item.selected) && (
                <div className="flex justify-between items-center gap-2 animate-fadeUp text-slate-100 bg-slate-400/10 uppercase font-light text-[0.8rem] tracking-wider rounded-full px-5 py-1">
                  Genre
                  <button
                    className="relative bottom-[1px]"
                    onClick={() => handleFilterClick()}
                  >
                    {<XIcon />}
                  </button>
                </div>
              )}
              {country && (
                <div className="flex justify-between items-center gap-2 animate-fadeUp text-slate-100 bg-slate-400/10 uppercase font-light text-[0.8rem] tracking-wider rounded-full px-5 py-1">
                  Country
                  <button
                    className="relative bottom-[1px]"
                    onClick={() => setCountry(null)}
                  >
                    {<XIcon />}
                  </button>
                </div>
              )}
              {releaseYear && (
                <div className="flex justify-between items-center gap-2 animate-fadeUp text-slate-100 bg-slate-400/10 uppercase font-light text-[0.8rem] tracking-wider rounded-full px-5 py-1">
                  Year
                  <button
                    className="relative bottom-[1px]"
                    onClick={() => setReleaseYear(null)}
                  >
                    {<XIcon />}
                  </button>
                </div>
              )}
            </div>
            <div
              id="movieList"
              className={`flex flex-wrap gap-6 mt-4 ${
                results?.results.length ? "animate-fadeUp" : ""
              }`}
            >
              {results?.results.map((item, index) => {
                return (
                  <Link href={`/movie/${item.id}`} key={index}>
                    <MovieItem
                      id={item.id}
                      poster={item.poster_path}
                      name={item.title || item.original_title || item.name}
                      release={item.release_date}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
}

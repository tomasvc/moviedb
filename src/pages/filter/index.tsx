import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { fetchDiscover } from "../api/fetchDiscover";
import { SideMenu } from "../../components/SideMenu";
import { FilterMenu } from "../../components/FilterMenu";
import { Header } from "../../components/Header";
import { useHeaderContext } from "../../contexts/headerContext";
import { MovieItem } from "../../components/MovieItem";
import { XIcon } from "../../components/Icons";
import { Pagination } from "@mui/material";

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
  const [page, setPage] = useState(1);

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
        releaseYear!,
        page
      );
      setResults(data);
    };
    fetchData();
  }, [genres, country, releaseYear, page]);

  const handleFilterClick = () => {
    const newArr = genres.map((item) => ({ ...item, selected: false }));
    setGenres(newArr);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (isClient)
    return (
      <div className="bg-[#192231] font-roboto">
        <Head>
          <title>Movies</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header open={open} setOpen={setOpen} transparent={false} />
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
                <div className="flex justify-between items-center gap-0.5 animate-fadeUp text-slate-100 bg-slate-400/10 uppercase font-light text-[0.8rem] tracking-wider rounded-full pl-4 pr-2 py-1">
                  Genre
                  <button
                    className="relative p-1"
                    onClick={() => handleFilterClick()}
                  >
                    <XIcon className="text-slate-100 w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              )}
              {country && (
                <div className="flex justify-between items-center gap-0.5 animate-fadeUp text-slate-100 bg-slate-400/10 uppercase font-light text-[0.8rem] tracking-wider rounded-full pl-4 pr-2 py-1">
                  Country
                  <button
                    className="relative p-1"
                    onClick={() => setCountry(null)}
                  >
                    <XIcon className="text-slate-100 w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              )}
              {releaseYear && (
                <div className="flex justify-between items-center gap-0.5 animate-fadeUp text-slate-100 bg-slate-400/10 uppercase font-light text-[0.8rem] tracking-wider rounded-full pl-4 pr-2 py-1">
                  Year
                  <button
                    className="relative p-1"
                    onClick={() => setReleaseYear(null)}
                  >
                    <XIcon className="text-slate-100 w-4 h-4" strokeWidth={2} />
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
                    <MovieItem movie={item} />
                  </Link>
                );
              })}
            </div>
            <Pagination
              color="primary"
              size="small"
              sx={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "2rem",
                "& .MuiPagination-ul": {
                  gap: "1rem",
                },
                "& .MuiPaginationItem-root": {
                  color: "white",
                },
              }}
              count={results ? Math.ceil(results.total_results / 20) : 0}
              page={page}
              onChange={handlePageChange}
            />
          </div>
        </main>
      </div>
    );
}

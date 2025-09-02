'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDiscover } from "@/api/fetchDiscover";
import { SideMenu } from "@/components/SideMenu";
import { FilterMenu } from "@/components/FilterMenu";
import { Header } from "@/components/Header";
import { useHeaderContext } from "@/contexts/headerContext";
import { MovieItem } from "@/components/MovieItem";
import { XIcon } from "@/components/Icons";
import { Pagination } from "@mui/material";

export default function Filter() {
  const { open, setOpen } = useHeaderContext();
  const [results, setResults] = useState<any>();
  const [genres, setGenres] = useState<any>([]);
  const [releaseYear, setReleaseYear] = useState<any>([]);
  const [country, setCountry] = useState<any>(null);
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
    value: number,
  ) => {
    setPage(value);
  };

  return (
    <div className="bg-[#192231] font-roboto overflow-x-hidden">
      <main className="relative flex bg-[#192231] w-full min-h-screen lg:mx-auto transition-all">
        <SideMenu selected="filter" />
        <div className="w-full">
          <Header open={open} setOpen={setOpen} />
          <div className="w-full pt-20">
            <FilterMenu
              genres={genres}
              setGenres={setGenres}
              setReleaseYear={setReleaseYear}
              country={country}
              setCountry={setCountry}
            />
            <div className="px-4 xl:px-10 pb-10">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-white text-2xl font-bold">Filter Results</h1>
                {(genres.some((g) => g.selected) || country || releaseYear.length > 0) && (
                  <button
                    onClick={handleFilterClick}
                    className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {results?.results?.map((movie: any, index: number) => (
                  <Link key={movie.id} href={`/movie/${movie.id}`}>
                    <MovieItem movie={movie} />
                  </Link>
                ))}
              </div>

              {results?.total_pages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    count={Math.min(results.total_pages, 500)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

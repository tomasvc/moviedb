"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { fetchDiscover } from "@/api/fetchDiscover";
import { FilterMenu } from "@/components/FilterMenu";
import { Header } from "@/components/Header";
import { useHeaderContext } from "@/contexts/headerContext";
import { MovieItem } from "@/components/MovieItem";
import { Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Genre, Movie } from "@/types/api";

export default function Filter() {
  const { open, setOpen } = useHeaderContext();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowFilters(window.innerWidth >= 1024);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [releaseYear, setReleaseYear] = useState<any>({
    type: "exact",
    value: new Date().getFullYear(),
  });
  const [country, setCountry] = useState<string>("United States");
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

  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["discover", genres, country, releaseYear, page],
    queryFn: () =>
      fetchDiscover(
        genres,
        country ? countryCodes[country as keyof typeof countryCodes] : "",
        releaseYear,
        page
      ),
    enabled: true,
  });

  const handleFilterClick = () => {
    const newArr = genres.map((item: Genre) => ({
      ...item,
      selected: false as boolean,
    }));
    setGenres(newArr);
    setReleaseYear({ type: "exact", value: new Date().getFullYear() });
    setCountry("United States");
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleCloseFilters = useCallback(() => {
    if (isAnimatingOut) return;

    setIsAnimatingOut(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowFilters(false);
      setIsAnimatingOut(false);
      timeoutRef.current = null;
    }, 200);
  }, [isAnimatingOut]);

  const handleToggleFilters = useCallback(() => {
    if (showFilters && !isAnimatingOut) {
      handleCloseFilters();
    } else if (!showFilters && !isAnimatingOut) {
      setShowFilters(true);
    }
  }, [showFilters, isAnimatingOut, handleCloseFilters]);

  return (
    <div className="bg-[#192231] font-roboto overflow-x-hidden">
      <main className="relative flex bg-[#192231] w-full min-h-screen lg:mx-auto transition-all">
        <div className="w-full lg:ml-16">
          <Header open={open} setOpen={setOpen} />
          <div className="w-full pt-16 lg:pt-20">
            <div className={showFilters || isAnimatingOut ? "block" : "hidden"}>
              <FilterMenu
                genres={genres}
                setGenres={setGenres}
                setReleaseYear={setReleaseYear}
                country={country}
                setCountry={setCountry}
                onClose={handleCloseFilters}
                isAnimatingOut={isAnimatingOut}
              />
            </div>
            <div
              className={`fixed inset-0 bg-black/50 z-10 transition-opacity duration-200 ${
                showFilters || isAnimatingOut
                  ? isAnimatingOut
                    ? "opacity-0"
                    : "opacity-100"
                  : "hidden"
              }`}
              onClick={handleCloseFilters}
            />
            <div className="px-4 lg:px-6 xl:px-10 pb-10 max-w-7xl mx-auto lg:mx-auto xl:!ml-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-white text-xl sm:text-2xl font-bold">
                    Filter Results
                  </h1>
                  <button
                    onClick={handleToggleFilters}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm transition flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                      />
                    </svg>
                    Filters
                  </button>
                </div>
                {(genres.some((g: Genre) => g.selected) ||
                  country !== "United States" ||
                  releaseYear.type !== "exact" ||
                  releaseYear.value !== new Date().getFullYear()) && (
                  <button
                    onClick={handleFilterClick}
                    className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition"
                  >
                    Reset to Defaults
                  </button>
                )}
              </div>

              <div className="min-h-[500px]">
                {isLoading && (
                  <div className="text-white text-center py-8 px-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className="mt-2 text-sm sm:text-base">
                      Loading movies...
                    </p>
                  </div>
                )}

                {error && !isLoading && (
                  <div className="text-red-500 text-center py-8 px-4">
                    <p className="text-sm sm:text-base mb-4">
                      Error: {error.message}
                    </p>
                    <button
                      onClick={() => {
                        refetch();
                      }}
                      className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {!isLoading &&
                  !error &&
                  results?.results &&
                  results.results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                      {results.results.map((movie: Movie, index: number) => (
                        <Link key={movie.id} href={`/movie/${movie.id}`}>
                          <MovieItem movie={movie} />
                        </Link>
                      ))}
                    </div>
                  )}

                {!isLoading &&
                  !error &&
                  results?.results &&
                  results.results.length === 0 && (
                    <div className="text-white text-center py-8 px-4">
                      <p className="text-sm sm:text-base mb-4">
                        No movies found with the selected filters
                      </p>
                      <button
                        onClick={handleFilterClick}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition"
                      >
                        Reset to Defaults
                      </button>
                    </div>
                  )}

                {!isLoading && !error && results?.total_pages > 1 && (
                  <div className="flex justify-center mt-8 px-2">
                    <Pagination
                      count={Math.min(results.total_pages, 500)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="medium"
                      siblingCount={0}
                      boundaryCount={1}
                      showFirstButton
                      showLastButton
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "white",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          minWidth: { xs: "28px", sm: "32px" },
                          height: { xs: "28px", sm: "32px" },
                        },
                        "& .MuiPaginationItem-page.Mui-selected": {
                          backgroundColor: "#5937ef",
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

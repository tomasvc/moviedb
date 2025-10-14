import React, { useEffect, useState } from "react";
import { fetchMovieGenres } from "../../api";
import { CheckIcon } from "../Icons";
import { Dropdown } from "../Dropdown";
import { SingleSlider } from "../SingleSlider";
import { DoubleSlider } from "../DoubleSlider";
import { Genre } from "@/types/api";

interface ReleaseYearRange {
  from: number;
  to: number;
}

interface ReleaseYearExact {
  type: string;
  value: number;
}

export const FilterMenu: React.FC<{
  genres: any;
  country: string;
  setGenres: (genres: any) => any;
  setCountry: (country: string) => any;
  setReleaseYear: (
    releaseYear: number | ReleaseYearRange | ReleaseYearExact
  ) => any;
  onClose?: () => void;
}> = ({ genres, country, setGenres, setCountry, setReleaseYear, onClose }) => {
  const [selectedYearSlider, setSelectedYearSlider] = useState("Exact");

  useEffect(() => {
    async function fetchData() {
      const movieGenres = await fetchMovieGenres();

      if (movieGenres) {
        let newArr: Genre[] = [];
        movieGenres.genres.map((item: Genre) => {
          newArr.push({ name: item.name, id: item.id, selected: false });
        });
        setGenres(newArr);
      }
    }

    fetchData();
  }, []);
  const clearFilters = () => {
    setCountry("United States");
    setSelectedYearSlider("Exact");
    setReleaseYear({ type: "exact", value: new Date().getFullYear() });
    const newArr = genres.map((item: Genre) => {
      if (item.selected) {
        return { ...item, selected: false };
      } else return item;
    });

    setGenres(newArr);
  };

  const handleSelect = (id: number) => {
    const newArr = genres.map((item: Genre) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      } else return item;
    });
    setGenres(newArr);
  };

  return (
    <div className="fixed top-0 lg:top-[3.75rem] left-0 lg:left-[3.75rem] w-full lg:w-56 h-full lg:h-[calc(100vh-3.75rem)] bg-[#232C3B] text-white pt-16 lg:pt-3.5 pb-5 !shadow-lg !shadow-black/50 z-20 animate-fadeLeft duration-300 ease-out overflow-y-auto">
      <div className="flex flex-col min-h-full">
        <div className="flex justify-between items-center pl-5 pr-3 mb-4">
          <h3 className="uppercase text-xl font-medium tracking-wider">
            Movies
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-gray-300 p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex flex-col flex-1 mt-4 pb-10 px-2 lg:px-0">
          <label className="text-gray-100 tracking-wide uppercase text-xs px-5 pb-1">
            Genres
          </label>
          <ul className="border-t border-t-gray-600 pt-4 pb-8">
            {genres &&
              genres.map((item: Genre) => {
                return (
                  <li
                    key={item.id}
                    className={`hover:bg-gray-100/5 px-5 hover:cursor-pointer ${
                      item.selected && "bg-slate-400/10"
                    }`}
                    onClick={() => handleSelect(item.id)}
                  >
                    <button className="flex justify-between uppercase tracking-wide text-gray-300 text-[0.8rem] text-left font-light w-full py-[0.2rem]">
                      {item.name}
                      {item.selected && <CheckIcon />}
                    </button>
                  </li>
                );
              })}
          </ul>

          <div>
            <label
              htmlFor="release"
              className="text-gray-100 tracking-wide uppercase text-xs px-5"
            >
              Release year
            </label>
            <div
              id="release"
              className="px-5 pb-4 py-4 flex flex-col gap-6 border-t border-t-gray-600"
            >
              <Dropdown
                placeholder="Select"
                options={["Range", "Exact"]}
                value={selectedYearSlider}
                setValue={setSelectedYearSlider}
              />
              {selectedYearSlider === "Range" ? (
                <DoubleSlider
                  ariaLabel="Release Year"
                  minValue={1970}
                  maxValue={new Date().getFullYear()}
                  defaultValue={[1970, new Date().getFullYear()]}
                  setValue={setReleaseYear}
                />
              ) : (
                <SingleSlider
                  ariaLabel="Release Year"
                  minValue={1970}
                  maxValue={new Date().getFullYear()}
                  defaultValue={new Date().getFullYear()}
                  setValue={setReleaseYear}
                />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="countries"
              className="text-gray-100 tracking-wide uppercase text-xs px-5"
            >
              Countries
            </label>
            <div
              id="countries"
              className="px-5 py-4 flex flex-col gap-6 border-t border-t-gray-600"
            >
              <Dropdown
                placeholder="Filter by country"
                options={[
                  "Australia",
                  "Canada",
                  "France",
                  "Germany",
                  "Italy",
                  "Japan",
                  "New Zealand",
                  "United Kingdom",
                  "United States",
                ]}
                value={country}
                setValue={setCountry}
              />
            </div>
          </div>

          <div className="flex mt-auto mx-2 lg:mx-4 pb-4">
            <button
              onClick={() => clearFilters()}
              className="bg-[#5937ef] hover:bg-[#633fff] active:bg-[#4d30cb] transition active:transition-none text-white text-xs px-4 py-2.5 w-full h-fit rounded-full uppercase"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

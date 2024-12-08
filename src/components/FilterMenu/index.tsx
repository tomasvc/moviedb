import React, { useEffect, useState } from "react";
import { fetchMovieGenres } from "../../api";
import { CheckIcon, CircleMenuHorizontal } from "../Icons";
import { Dropdown } from "../Dropdown";
import { SingleSlider } from "../SingleSlider";
import { DoubleSlider } from "../DoubleSlider";

interface GenreType {
  id: number;
  name: string;
  selected: boolean;
}

interface ReleaseYearRange {
  from: number;
  to: number;
}

export const FilterMenu: React.FC<{
  genres: any;
  country: string;
  setGenres: (genres: any) => any;
  setCountry: (country: string) => any;
  setReleaseYearFilterType: (type: string) => any;
  setReleaseYear: (releaseYear: number | ReleaseYearRange) => any;
  setVoteAverage: (voteAverage: number) => any;
  setVoteCount: (voteCount: number) => any;
}> = ({
  genres,
  country,
  setGenres,
  setCountry,
  setReleaseYear,
  setVoteAverage,
  setVoteCount,
}) => {
  const [selectedYearSlider, setSelectedYearSlider] = useState("Range");

  useEffect(() => {
    async function fetchData() {
      const movieGenres = await fetchMovieGenres();

      if (movieGenres) {
        let newArr: GenreType[] = [];
        movieGenres.genres.map((item) => {
          newArr.push({ name: item.name, id: item.id, selected: false });
        });
        setGenres(newArr);
      }
    }

    fetchData();
  }, []);
  const clearFilters = () => {
    setCountry("");
    const newArr = genres.map((item) => {
      if (item.selected) {
        return { ...item, selected: false };
      } else return item;
    });

    setGenres(newArr);
  };

  const handleSelect = (id: number) => {
    const newArr = genres.map((item) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      } else return item;
    });
    setGenres(newArr);
  };

  return (
    <div className="fixed top-[3.75rem] left-[3.75rem] w-56 h-full bg-[#232C3B] text-white pt-3.5 pb-5 !shadow-lg !shadow-black/50 z-20 animate-fadeLeft duration-300 ease-out">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center pl-5 pr-3 mb-4">
          <h3 className="uppercase text-xl font-medium tracking-wider">
            Movies
          </h3>
          <button className="hover:bg-slate-50/5 px-1 py-3 mb-1 rounded-full transition">
            <CircleMenuHorizontal />
          </button>
        </div>
        <div className="flex flex-col h-full overflow-y-auto mt-4 pb-10">
          <label className="text-gray-100 tracking-wide uppercase text-xs px-5 pb-1">
            Genres
          </label>
          <ul className="border-t border-t-gray-600 pt-4 pb-8">
            {genres &&
              genres.map((item: GenreType) => {
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

          {/* <div>
            <label
              htmlFor="ratings"
              className="text-gray-100 tracking-wide uppercase text-xs px-5"
            >
              Rating
            </label>
            <div className="px-5 flex flex-col border-t border-t-gray-600 pt-4 pb-6">
              <DoubleSlider
                ariaLabel="Vote average"
                label={"Vote average"}
                minValue={0}
                maxValue={10}
                defaultValue={[0, 10]}
                setValue={setVoteAverage}
              />
              <DoubleSlider
                ariaLabel="Vote count"
                label={"Vote count"}
                minValue={0}
                maxValue={5000}
                defaultValue={[0, 5000]}
                setValue={setVoteCount}
              />
            </div>
          </div> */}

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

          <div className="flex mt-auto mx-4 pb-4">
            <button
              onClick={() => clearFilters()}
              className="bg-[#5937ef] hover:bg-[#633fff] active:bg-[#4d30cb] transition active:transition-none text-white text-xs px-4 py-2.5 w-full h-fit rounded-full uppercase"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

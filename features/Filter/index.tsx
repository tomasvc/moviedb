import React, { useEffect, useState } from "react";
import Head from "next/head";
import { fetchDiscover } from "../../api";
import { SideMenu } from "../../components/SideMenu";
import { FilterMenu } from "../../components/FilterMenu";
import { Header } from "../../components/Header";
import { useHeaderContext } from "../../contexts/headerContext";
import { MovieItem } from "../../components/MovieItem";
import { XIcon } from "../../components/Icons";

export const Filter: React.FC = () => {
  const { open, setOpen } = useHeaderContext();
  const [results, setResults] = useState<any>();
  const [genres, setGenres] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDiscover(genres);
      setResults(data);
    };

    fetchData();
  }, [genres]);

  const handleFilterClick = () => {
    const newArr = genres.map((item) => {
      if (item.selected) {
        return { ...item, selected: false };
      } else return item;
    });

    setGenres(newArr);
  };

  return (
    <div className="bg-[#192231] font-roboto">
      <Head>
        <title>Movies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header open={open} setOpen={setOpen} />
      <main className="relative flex bg-[#192231] w-full min-h-screen lg:mx-auto transition-all">
        <SideMenu selected="filter" />
        <FilterMenu genres={genres} setGenres={setGenres} />
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
          </div>
          <div
            id="movieList"
            className={`flex flex-wrap gap-6 mt-4 ${
              results?.results.length ? "animate-fadeUp" : ""
            }`}
          >
            {results?.results.map((item: any) => {
              return (
                <MovieItem
                  key={item.id}
                  id={item.id}
                  poster={item.poster_path}
                  rating={item.rating}
                  name={item.title || item.original_title || item.name}
                  release={item.release_date}
                />
              );
            })}
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  );
};

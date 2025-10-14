import { debounce } from "lodash";
import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { parseOutput } from "@utils/parseOutput";
import { movieSearch, personSearch } from "@api";
import { XIcon, WarningIcon } from "@components/Icons";
import { SearchResult, APIResponse } from "@/types/api";

export const Search = ({
  setShowSearch,
}: {
  setShowSearch: (show: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");
  const [parsedOutput, setParsedOutput] = useState<{
    movies: SearchResult[];
    people: SearchResult[];
  }>({
    movies: [],
    people: [],
  });
  const [results, setResults] = useState<{
    movies: SearchResult[];
    people: SearchResult[];
  }>({
    movies: [],
    people: [],
  });
  const [displayResultsWindow, setDisplayResultsWindow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function searchQuery(query: string) {
    try {
      const response = await fetch("/api/search/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search");
      }

      setOutput(data.content);
    } catch (error: any) {
      console.error("Search error:", error);

      if (error.message.includes("Rate limit")) {
        setOutput("Rate limit exceeded. Please try again in a few moments.");
      } else if (error.message.includes("credits")) {
        setOutput(
          "Search service temporarily unavailable. Please try again later."
        );
      } else {
        setOutput("Could not process your search. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const debouncedSetQuery = useCallback(
    debounce((newValue) => {
      setQuery(newValue);
    }, 500),
    []
  );

  const handleInputChange = (event: any) => {
    debouncedSetQuery(event.target.value);
  };

  useEffect(() => {
    setResults({
      movies: [],
      people: [],
    });

    if (query.length > 0) {
      setDisplayResultsWindow(true);
      setLoading(true);
      searchQuery(query);
    } else {
      setDisplayResultsWindow(false);
    }
  }, [query]);

  useEffect(() => {
    if (output.length > 0) {
      const parsed = parseOutput(output);
      setParsedOutput({
        movies: parsed.movies.map((title: string) => ({ id: 0, title })),
        people: parsed.people.map((name: string) => ({ id: 0, name })),
      });
    }
  }, [output]);

  useEffect(() => {
    const fetchData = async (): Promise<Array<APIResponse | null>> => {
      if (
        Object.keys(parsedOutput).some(
          (key: string) =>
            parsedOutput[key as keyof typeof parsedOutput].length > 0
        )
      ) {
        const promises = [
          ...parsedOutput.movies.map((m) => movieSearch(m.title || "", 1)),
          ...parsedOutput.people.map((p) => personSearch(p.name || "", 1)),
        ];
        const data = await Promise.all(promises);
        return data.filter((result: any) => result !== null);
      }
      return [];
    };

    fetchData().then((data: Array<APIResponse | null>) => {
      let movies: SearchResult[] = [];
      let people: SearchResult[] = [];

      data?.forEach((item: APIResponse | null) => {
        if (item?.results?.[0] && "gender" in item.results[0]) {
          people.push(item.results[0] as SearchResult);
        } else {
          item?.results?.[0] && movies.push(item.results[0] as SearchResult);
        }
      });

      setResults({
        movies,
        people,
      });
      setLoading(false);
    });
  }, [parsedOutput]);

  const handleClose = () => {
    setShowSearch(false);
    setQuery("");
    setOutput("");
    setParsedOutput({
      movies: [],
      people: [],
    });
  };

  const handleClear = () => {
    setQuery("");
    setOutput("");
    setParsedOutput({
      movies: [],
      people: [],
    });
  };

  const handleCloseWithAnimation = () => {
    const searchContainer = document.getElementById(
      "search-container"
    ) as HTMLElement;
    if (searchContainer) {
      searchContainer.classList.add("animate-fadeOutScaleDown");
      searchContainer.addEventListener(
        "animationend",
        () => {
          searchContainer.classList.remove("animate-fadeOutScaleDown");
          handleClose();
        },
        { once: true }
      );
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseWithAnimation();
      }
    };

    const focusInputElement = () => {
      const inputElement = document.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      inputElement?.focus();
    };

    document.addEventListener("keydown", handleEsc);
    focusInputElement();

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      <div
        id="search-container"
        className="fixed top-0 left-0 w-screen h-screen bg-black/60 z-50 backdrop-blur-xl animate-fadeInScaleUp"
      >
        <button
          className="absolute top-5 right-5 z-10 text-white hover:bg-slate-500/20 active:bg-slate-500/30 transition active:transition-none ease-out duration-300 rounded-full p-2"
          onClick={handleCloseWithAnimation}
        >
          <XIcon
            className="w-8 sm:w-12 h-auto text-gray-200"
            strokeWidth={0.5}
          />
        </button>
        <div className="container max-w-6xl flex flex-col mx-auto w-full h-full justify-start pt-6 px-4 sm:px-0">
          <div>
            <div className="flex items-end gap-2 pb-6 pl-0 xl:pl-3 w-[80%]">
              <WarningIcon className="w-4 h-4 text-slate-100/60" />
              <p className="text-slate-100/60 text-[0.5rem] md:text-xs w-w-full">
                Search powered by AI - results may not always be accurate.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search movies, actors, etc"
              className="w-full h-fit bg-transparent text-white/90 text-lg sm:text-3xl lg:text-5xl !border-0 !ring-0 !outline-0 placeholder-slate-500 mb-4 pt-4"
              onChange={handleInputChange}
            />
          </div>
          <div>
            {loading && (
              <div className="flex items-center gap-4 h-fit animate-fadeIn duration-200 ease-out">
                <CircularProgress
                  size={18}
                  color="inherit"
                  className="text-indigo-500"
                />
                <p className="text-indigo-400">Searching...</p>
              </div>
            )}
            <div className="container mx-auto flex flex-col gap-10 animate-fadeIn overflow-y-auto h-[80vh]">
              <div>
                {results.movies?.length > 0 && (
                  <>
                    <p className="text-slate-200 font-medium uppercase tracking-wider pl-4 pb-2 animate-fadeIn duration-200 ease-out">
                      Movies
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full p-2 md:p-4">
                      {results.movies?.map((m: SearchResult, index: number) => (
                        <Link
                          key={index}
                          href={`/movie/${m?.id}`}
                          className="relative flex items-center gap-4 rounded-lg bg-[#232b3b] shadow-md hover:shadow-lg hover:bg-indigo-900/80 transition-all p-2 sm:p-4 cursor-pointer text-white group animate-fadeIn duration-200 ease-out border border-transparent hover:border-indigo-500"
                          onClick={() => setDisplayResultsWindow(false)}
                        >
                          {m?.poster_path ? (
                            <div className="flex flex-shrink-0 items-center justify-center rounded-lg overflow-hidden w-16 h-24 sm:w-24 sm:h-36 bg-black/50 group-hover:scale-105 transition-transform">
                              <Image
                                src={`https://image.tmdb.org/t/p/w400${m?.poster_path}`}
                                alt={m?.title || "Movie poster"}
                                width={96}
                                height={144}
                                className="object-cover w-full h-full"
                                priority
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-16 h-24 sm:w-24 sm:h-36 bg-black/70 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                              No Image
                            </div>
                          )}

                          <div className="flex flex-col justify-center flex-1">
                            <p className="font-semibold text-base sm:text-lg text-slate-50 group-hover:text-[#adff4f]">
                              {m?.title}
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                              {m?.release_date ? (
                                <span className="inline-block bg-[#adff4f]/10 text-[#adff4f] text-xs px-2 py-1 rounded uppercase font-bold tracking-wider shadow-sm border border-[#adff4f]/40">
                                  {moment(m?.release_date).format("YYYY")}
                                </span>
                              ) : (
                                <span className="inline-block text-slate-400 text-xs px-2 py-1 rounded uppercase tracking-wider border border-slate-600/30">
                                  Unknown Year
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col pb-20">
                {results.people.length > 0 && (
                  <>
                    <p className="text-slate-200 font-medium uppercase tracking-wider pl-4 pb-2 animate-fadeIn duration-200 ease-out">
                      People
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full p-2 md:p-4">
                      {results.people?.map((p: SearchResult, index: number) => (
                        <Link
                          key={index}
                          href={`/person/${p.id}`}
                          className="flex items-center bg-[#222b39] hover:bg-indigo-900/80 rounded-xl shadow-md hover:shadow-lg transition-all p-3 gap-4 group cursor-pointer border border-transparent hover:border-indigo-400 animate-fadeIn duration-200 ease-out"
                          onClick={() => setDisplayResultsWindow(false)}
                        >
                          <div className="relative flex-shrink-0">
                            {p?.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w185${p?.profile_path}`}
                                alt={p?.name || "Profile image"}
                                className="rounded-lg object-cover border-2 border-indigo-700/40 group-hover:border-[#adff4f]/70 shadow-lg w-16 h-16"
                                width={64}
                                height={64}
                                priority
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-black/80 flex items-center justify-center text-slate-500 text-xs border border-slate-700/20">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base text-slate-50 group-hover:text-[#adff4f] truncate">
                              {p?.name}
                            </p>
                          </div>
                          <span className="ml-2 text-[#adff4f] opacity-0 group-hover:opacity-100 transition duration-150">
                            &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

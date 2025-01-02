import { debounce } from "lodash";
import OpenAI from "openai";
import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { parseOutput } from "@utils/parseOutput";
import { movieSearch, personSearch } from "@api";
import { XIcon, WarningIcon } from "@components/Icons";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type Result = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  profile_path?: string;
  gender?: number;
};

export const Search = ({
  setShowSearch,
}: {
  setShowSearch: (show: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");
  const [parsedOutput, setParsedOutput] = useState<{
    movies: Result[];
    people: Result[];
  }>({
    movies: [],
    people: [],
  });
  const [results, setResults] = useState<any>({
    movies: [],
    people: [],
  });
  const [openMenu, setOpenMenu] = useState(false);
  const [displayResultsWindow, setDisplayResultsWindow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function searchQuery(query: string) {
    await openai.chat.completions
      .create({
        messages: [
          {
            role: "user",
            content: `Classify and structure the following query: '${query}'. Based on the query, return a list with these three sections if it is suitable for the query: movie titles, people (either cast, crew or both) and movie genres. Make sure the section labels end with a colon. Provide only the results without any additional text. Provide at least 10 items per list if you can. Try not not to include any innacurate information. Do not add any descriptions. If you cannot find anything based on the query, or if the provided query makes no sense, simply respond with 'Could not find any information with the provided query'.`,
          },
        ],
        model: "gpt-4o-mini",
      })
      .then((response) => {
        setOutput(response?.choices[0]?.message?.content!);
      });
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
      setParsedOutput(
        parseOutput(output) as { movies: Result[]; people: Result[] }
      );
    }
  }, [output]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        Object.keys(parsedOutput).some((key) => parsedOutput[key].length > 0)
      ) {
        parsedOutput.movies.map((m) => console.log(m.title));
        const promises = [
          ...parsedOutput.movies.map((m) => movieSearch(m as any)),
          ...parsedOutput.people.map((p) => personSearch(p as any)),
        ];
        const data = await Promise.all(promises);
        return data.filter((result) => result !== null);
      }
    };

    fetchData().then((data) => {
      let movies: Result[] = [];
      let people: Result[] = [];

      data?.forEach((item: { results: Result[] }) => {
        if (item.results[0]?.gender) {
          people.push(item.results[0] as Result);
        } else {
          item.results[0] && movies.push(item.results[0] as Result);
        }
      })

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
        <div className="container flex flex-col mx-auto w-full h-full justify-start pt-6 px-4 sm:px-0">
          <div>
            <div className="flex items-end gap-2 pb-6 pl-0 xl:pl-2 w-[80%]">
              <WarningIcon className="w-4 h-4 text-slate-100/60" />
              <p className="text-slate-100/60 text-[0.5rem] md:text-xs w-w-full">
                Search powered by AI - results may not always be accurate.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search movies, actors, etc"
              className="w-full h-fit bg-transparent text-white/90 text-lg sm:text-3xl lg:text-5xl !border-0 !ring-0 !outline-0 placeholder-slate-500 mb-10 pt-4"
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
                    <p className="text-slate-200 font-medium uppercase tracking-wider pl-2 pb-2 animate-fadeIn duration-200 ease-out">
                      Movies
                    </p>
                    <div className="flex flex-col md:flex-row flex-wrap w-full xl:w-1/2">
                      {results.movies?.map((m, index) => {
                        return (
                          <Link
                            key={index}
                            href={`/movie/${m?.id}`}
                            className="relative w-full md:w-1/2 flex gap-3 rounded p-4 cursor-pointer text-white hover:bg-slate-800/70 transition animate-fadeIn duration-200 ease-out"
                            onClick={() => setDisplayResultsWindow(false)}
                          >
                            {m?.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w400${m?.poster_path}`}
                                alt={m?.title || "Movie poster"}
                                className="rounded-sm"
                                width={50}
                                height={100}
                                unoptimized={true}
                                priority
                              />
                            ) : (
                              <div className="w-[50px] h-[100px] bg-black/70 rounded-sm"></div>
                            )}

                            <div className="text-left">
                              <p className="font-medium text-sm leading-5">
                                {m?.title}
                              </p>
                              {m?.release_date && (
                                <p className="text-[#adff4f] text-xs font-medium uppercase tracking-wider">
                                  {moment(m?.release_date).format("YYYY")}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col pb-20">
                {results.people.length > 0 && (
                  <>
                    <p className="text-white uppercase tracking-wider font-light pl-2 pb-2 animate-fadeIn duration-200 ease-out">
                      People
                    </p>
                    <div className="flex flex-col md:flex-row flex-wrap w-full xl:w-1/2">
                      {results.people?.map((p, index) => {
                        return (
                          <Link
                            key={index}
                            href={`/person/${p.id}`}
                            className="relative w-full md:w-1/2 flex gap-3 rounded p-4 cursor-pointer text-white hover:bg-slate-800/80 transition animate-fadeIn duration-200 ease-out"
                            onClick={() => setDisplayResultsWindow(false)}
                          >
                            {p?.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w400${p?.profile_path}`}
                                alt={p?.name || "Profile image"}
                                className="rounded-md shadow-xl"
                                width={50}
                                height={100}
                                unoptimized={true}
                                priority
                              />
                            ) : (
                              <div className="w-[50px] h-[100px] bg-black/70"></div>
                            )}

                            <div className="mr-1 text-left">
                              <p className="font-medium text-sm leading-5">
                                {p?.name}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
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

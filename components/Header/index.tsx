import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { movieSearch, personSearch } from "../../api";
import { signIn, useSession } from "next-auth/react";
import { Transition } from "@headlessui/react";
import { UserMenu } from "../UserMenu";
import { MovieItem } from "../MovieItem";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { SearchIcon } from "../Icons";
import { debounce } from "lodash";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import moment from "moment";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const UserIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};

const WarningIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-slate-100/60"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
};

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transparent?: boolean;
};

export const Header = ({ open, setOpen }: HeaderProps) => {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");
  const [parsedOutput, setParsedOutput] = useState({
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

  const { data } = useSession();

  const wrapperRef = useRef(null);
  useOnClickOutside(wrapperRef, () => setOpenMenu(false));

  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    // async function fetchResults() {
    //   const data = await multiSearch(query);
    //   setResults(data.results);
    // }
    // fetchResults();

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
      parseOutput(output);
    }
  }, [output]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        Object.keys(parsedOutput).some((key) => parsedOutput[key].length > 0)
      ) {
        const promises = [
          ...parsedOutput.movies.map((m) => movieSearch(m)),
          ...parsedOutput.people.map((p) => personSearch(p)),
        ];

        const data = await Promise.all(promises);
        return data.filter((result) => result !== null);
      }
    };

    fetchData().then((data) => {
      let movies = [];
      let people = [];

      data?.forEach((item) => {
        if (item.results[0]?.gender) {
          people.push(item.results[0]!);
        } else {
          item.results[0] && movies.push(item.results[0]);
        }
      });

      setResults({
        movies,
        people,
      });
      setLoading(false);
    });
  }, [parsedOutput]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  async function searchQuery(query: string) {
    const chatCompletion = await openai.chat.completions
      .create({
        messages: [
          {
            role: "user",
            content: `Classify and structure the following query: '${query}'. Based on the query, return a list with these three sections if it is suitable for the query: movie titles, people (either cast, crew or both) and movie genres. Provide only the results without any additional text. Provide at least 10 items per list if you can. Try not not to include any innacurate information. Do not add any descriptions. If you cannot find anything based on the query, or if the provided query makes no sense, simply respond with 'Could not find any information with the provided query'.`,
          },
        ],
        model: "gpt-3.5-turbo-0125",
      })
      .then((response) => {
        setOutput(response?.choices[0]?.message?.content);
      });
  }

  function parseOutput(str: string) {
    const normalizedStr = str.replace(/- /g, "").trim();

    // Split the string into sections
    const sections = normalizedStr.split("\n\n").reduce((acc, section) => {
      const titleEndIndex = section.indexOf(":");
      let title = section
        .substring(0, titleEndIndex)
        .replace(/\s+/g, "_")
        .toLowerCase(); // Normalize titles to be consistent with the keys

      title = title.replace("(", "").replace(")", "").replace("-", "_");

      const content = section
        .substring(titleEndIndex + 1)
        .trim()
        .split("\n")
        .map((line) =>
          line
            .replace(/^\s*\d+\.\s*/, "") // Remove numeric prefixes if present
            .replace(/^\s*-\s*/, "") // Remove dash prefixes if present
            .replace(/\*/g, "") // Remove asterisks within content
            .replace(/\s*\([^)]*\)/, "") // Remove parentheses with content
            .trim()
        );
      acc[title] = content;
      return acc;
    }, {});

    const movies = sections["movie_titles"] || [];
    const people = sections["people"] || [];

    setParsedOutput({ movies: Array.from(new Set(movies)), people });
  }

  const handleAccountClick = () => {
    if (data?.user) {
      setOpenMenu(!openMenu);
    } else {
      signIn("auth0");
    }
  };

  const debouncedSetQuery = useCallback(
    debounce((newValue) => {
      setQuery(newValue);
    }, 500),
    []
  );

  const handleInputChange = (event: any) => {
    debouncedSetQuery(event.target.value);
  };

  return (
    <header
      className={`${
        open ? "backdrop-blur-md" : "backdrop-blur-sm"
      } fixed w-full border-b border-slate-600/30 bg-gradient-to-b from-[#0F1827] to-transparent flex transition-all pl-16 z-40`}
    >
      <div className="flex flex-col justify-between items-center w-full relative px-4 py-[0.7rem]">
        <div className="w-full flex">
          <div className="flex w-full lg:w-1/2 pr-4 lg:pr-0">
            <button className="text-white z-20 mr-6 py-2">
              <SearchIcon />
            </button>
            <input
              type="text"
              placeholder="Search movies, actors, etc"
              className="w-full bg-transparent text-white text-sm font-light border-0 ring-0 outline-0 placeholder-gray-400 tracking-wide"
              onChange={handleInputChange}
            />
          </div>
          <div className="relative top-0.5 ml-auto py-[3px]">
            <button
              className={`text-white z-20 transition-all ${open && "hidden"}`}
              onClick={() => handleAccountClick()}
            >
              {data?.user ? (
                <div className="w-8 h-8 font-light rounded-full bg-indigo-600 flex justify-center items-center">
                  <p className="pt-0.5">
                    {data.user.name.slice(0, 1).toUpperCase()}
                  </p>
                </div>
              ) : (
                <UserIcon />
              )}
            </button>
            <div ref={wrapperRef} className="absolute top-11 -right-2">
              <Transition
                show={openMenu}
                enter="transition-all opacity transform duration-150"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all opacity transform duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <UserMenu name={data?.user?.name} />
              </Transition>
            </div>
          </div>
        </div>
        {displayResultsWindow && (
          <div className="relative top-[1rem] left-[1.8rem] px-10 pl-16 pt-4 pb-32 flex flex-col z-20 w-screen h-screen overflow-y-auto">
            <div className="flex gap-2 pb-6 pl-2">
              <WarningIcon />
              <p className="text-slate-100/60 text-xs w-full xl:w-2/3 2xl:w-1/2">
                The search feature is powered by AI to accommodate Natural
                Language Processing (NLP) - this means that you can provide any
                query you want and the AI will do its best attempt to guess the
                results. The AI model used for this feature has a cut-off
                knowledge date of April 2021 as of last update. Please be aware
                that some search results using AI-generated content may be
                inaccurate. This feature is created for experimental purposes
                only.
              </p>
            </div>
            {loading && (
              <div className="flex flex-col justify-center items-center gap-4 h-full">
                <CircularProgress />
                <p className="text-white">Processing your query</p>
              </div>
            )}
            <div className="flex flex-col gap-10">
              <div>
                {results.movies?.length > 0 && (
                  <>
                    <p className="text-white uppercase tracking-wider font-light pl-2 pb-2">
                      Movies
                    </p>
                    <div className="flex flex-col md:flex-row flex-wrap w-full xl:w-1/2">
                      {results.movies?.map((m, index) => {
                        return (
                          <Link
                            key={index}
                            href={`/movie/${m?.id}`}
                            className="relative w-full md:w-1/2 flex gap-3 rounded-sm p-2 cursor-pointer text-white hover:bg-slate-800/80 transition duration-200 ease-out"
                            onClick={() => setDisplayResultsWindow(false)}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w400${m?.poster_path}`}
                              alt={m?.title || "Movie poster"}
                              className="rounded-sm"
                              width={50}
                              height={100}
                              priority
                            />
                            <div className="mt-3 text-left">
                              <p className="font-medium text-sm leading-5 uppercase tracking-wide">
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

              <div className="flex flex-col">
                {results.people.length > 0 && (
                  <>
                    <p className="text-white uppercase tracking-wider font-light pl-2 pb-2">
                      People
                    </p>
                    <div className="flex flex-col md:flex-row flex-wrap w-full xl:w-1/2">
                      {results.people?.map((p, index) => {
                        return (
                          <Link
                            key={index}
                            href={`/person/${p.id}`}
                            className="relative w-full md:w-1/2 flex gap-3 rounded-sm p-2 cursor-pointer text-white hover:bg-slate-800/80 transition duration-200 ease-out"
                            onClick={() => setDisplayResultsWindow(false)}
                          >
                            {p?.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w400${p?.profile_path}`}
                                alt={p?.name || "Profile image"}
                                className="rounded-md shadow-xl"
                                width={50}
                                height={100}
                                priority
                              />
                            ) : (
                              <div className="w-[50px] h-[100px] bg-black/70"></div>
                            )}

                            <div className="mt-3 mr-1 text-left">
                              <p className="font-medium text-sm leading-5 uppercase tracking-wide">
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
        )}
      </div>
    </header>
  );
};

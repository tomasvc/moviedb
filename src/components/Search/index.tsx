import { debounce } from "lodash";
import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { movieSearch, personSearch } from "@/api/search";
import { XIcon, WarningIcon } from "@components/Icons";
import { SearchResult, SearchGPTResponse, VibeRecommendation } from "@/types/api";

type VibeResult = {
  movie: SearchResult;
  blurb: string;
};

export const Search = ({
  setShowSearch,
}: {
  setShowSearch: (show: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState<SearchGPTResponse | null>(null);
  const [results, setResults] = useState<{ movies: SearchResult[]; people: SearchResult[] }>({
    movies: [],
    people: [],
  });
  const [vibeResults, setVibeResults] = useState<VibeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function fetchSearchResponse(q: string) {
    try {
      const response = await fetch("/api/search/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search");
      }

      setSearchResponse(data as SearchGPTResponse);
    } catch (error: any) {
      console.error("Search error:", error);
      setErrorMessage(error.message || "Could not process your search. Please try again.");
      setSearchResponse(null);
      setLoading(false);
    }
  }

  const debouncedSetQuery = useCallback(
    debounce((newValue: string) => {
      setQuery(newValue);
    }, 500),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetQuery(event.target.value);
  };

  // Trigger API call when query changes
  useEffect(() => {
    setResults({ movies: [], people: [] });
    setVibeResults([]);
    setSearchResponse(null);
    setErrorMessage(null);

    if (query.length > 0) {
      setLoading(true);
      fetchSearchResponse(query);
    }
  }, [query]);

  // Resolve TMDB data from the structured response
  useEffect(() => {
    if (!searchResponse) return;

    const resolve = async () => {
      if (searchResponse.mode === "regular") {
        const titles = searchResponse.titles;
        const people = searchResponse.people;

        const [movieData, personData] = await Promise.all([
          Promise.all(titles.map((t) => movieSearch(t, 1))),
          Promise.all(people.map((p) => personSearch(p, 1))),
        ]);

        const movies = movieData
          .map((r) => r?.results?.[0])
          .filter((m): m is SearchResult => !!m);
        const peopleResults = personData
          .map((r) => r?.results?.[0] as SearchResult | undefined)
          .filter((p): p is SearchResult => !!p);

        setResults({ movies, people: peopleResults });
      } else if (searchResponse.mode === "vibe") {
        const recs = searchResponse.recommendations;
        const resolved = await Promise.all(
          recs.map(async (rec: VibeRecommendation) => {
            const result = await movieSearch(rec.title, 1);
            const movie = result?.results?.[0];
            return movie ? { movie, blurb: rec.blurb } : null;
          })
        );
        setVibeResults(resolved.filter((r): r is VibeResult => r !== null));
      }

      setLoading(false);
    };

    resolve();
  }, [searchResponse]);

  const handleClose = () => {
    setShowSearch(false);
    setQuery("");
    setSearchResponse(null);
    setResults({ movies: [], people: [] });
    setVibeResults([]);
  };

  const handleCloseWithAnimation = () => {
    const searchContainer = document.getElementById("search-container") as HTMLElement;
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
      if (event.key === "Escape") handleCloseWithAnimation();
    };
    const focusInput = () => {
      (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus();
    };
    document.addEventListener("keydown", handleEsc);
    focusInput();
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const isVibe = searchResponse?.mode === "vibe";

  return (
    <div
      id="search-container"
      className="fixed top-0 left-0 w-screen h-screen bg-black/60 z-50 backdrop-blur-xl animate-fadeInScaleUp"
    >
      <button
        className="absolute top-5 right-5 z-10 text-white hover:bg-slate-500/20 active:bg-slate-500/30 transition active:transition-none ease-out duration-300 rounded-full p-2"
        onClick={handleCloseWithAnimation}
      >
        <XIcon className="w-8 sm:w-12 h-auto text-gray-200" strokeWidth={0.5} />
      </button>

      <div className="container max-w-3xl flex flex-col mx-auto w-full h-full justify-start pt-6 px-4 sm:px-0">
        {/* Input area */}
        <div className="pb-6 border-b border-white/[0.07]">
          {isVibe && (
            <div className="inline-flex items-center gap-1.5 bg-[#adff4f]/[0.07] border border-[#adff4f]/20 rounded-full px-3 py-1 mb-4 animate-fadeIn">
              <span className="text-[#adff4f] text-[8px]">✦</span>
              <span className="text-[#adff4f] text-[10px] font-bold uppercase tracking-widest">Vibe Search</span>
            </div>
          )}
          {!isVibe && (
            <div className="flex items-end gap-2 pb-4">
              <WarningIcon className="w-4 h-4 text-slate-100/60" />
              <p className="text-slate-100/60 text-[0.5rem] md:text-xs">
                Search powered by AI - results may not always be accurate.
              </p>
            </div>
          )}
          <input
            type="text"
            placeholder="Search movies, actors, or describe a vibe..."
            className="w-full h-fit bg-transparent text-white/90 text-lg sm:text-3xl lg:text-5xl !border-0 !ring-0 !outline-0 placeholder-slate-500 font-light"
            onChange={handleInputChange}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-4 h-fit animate-fadeIn duration-200 ease-out mt-5">
            <CircularProgress size={18} color="inherit" className="text-indigo-500" />
            <p className="text-indigo-400">Searching...</p>
          </div>
        )}
        {errorMessage && !loading && (
          <p className="text-red-400/80 text-sm mt-5 animate-fadeIn">{errorMessage}</p>
        )}

        {/* Scrollable results area */}
        <div className="overflow-y-auto h-[80vh] mt-5 flex flex-col gap-8">
          {/* Vibe mode */}
          {isVibe && !loading && (
            <>
              {searchResponse?.filters && (
                <FilterBar filters={searchResponse.filters} />
              )}

              {vibeResults.length > 0 && (
                <div>
                  <SectionLabel>Best matches</SectionLabel>
                  <div className="flex flex-col gap-2">
                    {vibeResults.map((r, i) => (
                      <VibeResultCard
                        key={r.movie.id}
                        rank={i + 1}
                        movie={r.movie}
                        blurb={r.blurb}
                        onClick={() => setShowSearch(false)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Regular mode */}
          {!isVibe && !loading && (
            <>
              {results.movies.length > 0 && (
                <div>
                  <SectionLabel>Movies</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full p-2 md:p-4">
                    {results.movies.map((m, index) => (
                      <Link
                        key={index}
                        href={`/movie/${m?.id}`}
                        className="relative flex items-center gap-4 rounded-lg bg-[#232b3b] shadow-md hover:shadow-lg hover:bg-indigo-900/80 transition-all p-2 sm:p-4 cursor-pointer text-white group animate-fadeIn duration-200 ease-out border border-transparent hover:border-indigo-500"
                        onClick={() => setShowSearch(false)}
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
                </div>
              )}

              {results.people.length > 0 && (
                <div className="pb-20">
                  <SectionLabel>People</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full p-2 md:p-4">
                    {results.people.map((p, index) => (
                      <Link
                        key={index}
                        href={`/person/${p.id}`}
                        className="flex items-center bg-[#222b39] hover:bg-indigo-900/80 rounded-xl shadow-md hover:shadow-lg transition-all p-3 gap-4 group cursor-pointer border border-transparent hover:border-indigo-400 animate-fadeIn duration-200 ease-out"
                        onClick={() => setShowSearch(false)}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/30">
        {children}
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function FilterBar({ filters }: { filters: SearchGPTResponse["filters"] }) {
  if (!filters) return null;

  const hasContent =
    (filters.mood?.length ?? 0) > 0 ||
    filters.max_runtime != null ||
    (filters.exclude_genres?.length ?? 0) > 0 ||
    (filters.include_genres?.length ?? 0) > 0;

  if (!hasContent) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-[#adff4f]/[0.04] border border-[#adff4f]/[0.12] rounded-xl animate-fadeIn">
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#adff4f]/50 mr-1">
        Understood
      </span>

      {filters.mood && filters.mood.length > 0 && (
        <FilterChip label="mood" value={filters.mood.join(" · ")} />
      )}
      {filters.max_runtime != null && (
        <FilterChip label="runtime" value={`< ${filters.max_runtime} min`} />
      )}
      {filters.include_genres && filters.include_genres.length > 0 && (
        <FilterChip label="genres" value={filters.include_genres.join(", ")} />
      )}
      {filters.exclude_genres && filters.exclude_genres.length > 0 && (
        <FilterChip label="excluding" value={filters.exclude_genres.join(", ")} variant="exclude" />
      )}
    </div>
  );
}

function FilterChip({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "exclude";
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full px-3 py-1 text-[11px]">
      <span className="text-white/35">{label}</span>
      <span className={variant === "exclude" ? "text-red-400 font-medium" : "text-slate-300 font-medium"}>
        {value}
      </span>
    </span>
  );
}

function VibeResultCard({
  rank,
  movie,
  blurb,
  onClick,
}: {
  rank: number;
  movie: SearchResult;
  blurb: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      onClick={onClick}
      className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 hover:bg-indigo-900/20 hover:border-indigo-500/30 transition-all group animate-fadeIn"
    >
      <span className="text-[11px] font-bold text-white/15 w-4 text-center flex-shrink-0">
        {rank}
      </span>
      <div className="w-[42px] h-[60px] rounded-md flex-shrink-0 overflow-hidden bg-[#1e2a3a]">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title || "Movie poster"}
            width={42}
            height={60}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
            —
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-slate-100 group-hover:text-[#adff4f] transition-colors">
          {movie.title}
        </p>
        {movie.release_date && (
          <span className="inline-block mt-1 text-[10px] font-bold text-[#adff4f] bg-[#adff4f]/[0.08] border border-[#adff4f]/20 px-2 py-0.5 rounded">
            {moment(movie.release_date).format("YYYY")}
          </span>
        )}
        <p className="text-[12px] text-slate-500 mt-1.5 leading-snug">{blurb}</p>
      </div>
      <span className="text-white/15 group-hover:text-[#adff4f] group-hover:translate-x-1 transition-all text-base flex-shrink-0">
        ›
      </span>
    </Link>
  );
}

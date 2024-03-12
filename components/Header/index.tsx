import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { multiSearch } from "../../pages/api";
import { signIn, useSession } from "next-auth/react";
import { Transition } from "@headlessui/react";
import { UserMenu } from "../UserMenu";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { SearchIcon } from "../Icons";
import clsx from "clsx";
import moment from "moment";

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

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transparent?: boolean;
};

export const Header = ({ open, setOpen }: HeaderProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const router = useRouter();
  const { data } = useSession();

  const wrapperRef = useRef(null);
  useOnClickOutside(wrapperRef, () => setOpenMenu(false));

  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    async function fetchResults() {
      const data = await multiSearch(query);
      setResults(data.results);
    }
    fetchResults();
  }, [query]);

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const handleClick = (id: string, media_type: string) => {
    setOpen(false);
    if (media_type === "movie") {
      router.push(`/movie/${id}`);
    }
    if (media_type === "person") {
      router.push(`/person/${id}`);
    }
  };

  const handleAccountClick = () => {
    if (data?.user) {
      setOpenMenu(!openMenu);
    } else {
      signIn("auth0");
    }
  };

  return (
    <header className="fixed w-full backdrop-blur-sm bg-[#0F1827]/80 flex transition-all pl-16 z-40">
      <div className="flex justify-between items-center w-full relative px-4 py-[0.7rem]">
        {/* <div
          onClick={() => router.push(`/`)}
          className={clsx(
            "text-white text-sm font-light z-20 py-3 mx-auto uppercase cursor-pointer transition-all",
            { "opacity-0": open }
          )}
        >
          The <span className="text-xl text-yellow-300">Movie</span> Hub
        </div> */}
        {/* <div className="flex w-1/2">
          <button className="text-white z-20 mr-6 py-2">
            <SearchIcon />
          </button>
          <input
            type="text"
            placeholder="Search movies, actors, editors, etc"
            className="w-full bg-transparent text-white text-sm font-light border-0 ring-0 outline-0 placeholder-gray-400 tracking-wide"
          />
        </div> */}
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
        <input
          placeholder="Search movies, tv shows or people..."
          onChange={(e) => setQuery(e.target.value)}
          className={clsx(
            "absolute top-2 left-10 lg:left-0 z-20 w-[90%] px-10 py-2 bg-transparent text-white text-xl outline-none border-none",
            { flex: open, hidden: !open }
          )}
          type="text"
          autoComplete="off"
        />
        <div
          className={clsx(
            "absolute top-[4.3rem] left-0 px-10 flex flex-col z-20 w-full h-screen overflow-auto",
            {
              hidden: !open,
            }
          )}
        >
          {results?.map((item: any) => {
            return (
              <div
                className="flex p-10 xl:px-0 cursor-pointer transition-all border-b border-gray-400/40 w-full mx-auto"
                onClick={() => handleClick(item.id, item.media_type)}
              >
                <img
                  className="w-20 xl:w-40 rounded-sm xl:rounded-md"
                  src={`https://image.tmdb.org/t/p/w400${
                    item.poster_path || item.profile_path
                  }`}
                />
                <div className="flex flex-col justify-between ml-4 xl:ml-8">
                  <div>
                    <p className="text-white text-xl font-semibold">
                      {item.title || item.name || item.original_title} •{" "}
                      <span className="font-light capitalize">
                        {item.media_type}
                      </span>
                    </p>
                    {item.media_type !== "person" && (
                      <p className="text-white">
                        {moment(item.release_date).format("MMMM d YYYY")}
                      </p>
                    )}
                  </div>
                  {item.media_type !== "person" && (
                    <div>
                      <p className="text-white text-sm bg-black w-fit px-4 py-2 rounded-full border-2 border-yellow-400">
                        {Math.round(item.vote_average)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

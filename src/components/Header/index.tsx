"use client";

import React, { useEffect, useState } from "react";
import { FilmIcon, SearchIcon } from "../Icons";
import { Search } from "../Search";
import { createPortal } from "react-dom";
import Link from "next/link";
import { HomeIcon } from "../Icons";

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Header = ({ open, setOpen }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [headerStyles, setHeaderStyles] = useState("");

  useEffect(() => {
    setOpen(false);

    let styles = "";
    if (typeof window !== "undefined") {
      styles =
        (window.innerWidth > 500 && !open) || (window.innerWidth < 500 && !open)
          ? "to-transparent"
          : window.innerWidth < 500 && open
          ? "to-[#090e17]/80"
          : "to-transparent";
    }

    setHeaderStyles(styles);
  }, []);

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

  const handleOpenSearch = () => {
    setShowSearch(true);
    setOpen(false);
  };

  useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showSearch]);

  return (
    <header
      className={`${
        open ? "backdrop-blur-md" : "backdrop-blur-sm"
      } fixed w-full border-b border-slate-600/30 bg-gradient-to-b from-[#0F1827] ${headerStyles} flex transition-all z-40`}
    >
      <div className="flex flex-col justify-between items-center w-full relative px-1 lg:px-0">
        <div className="w-full flex justify-between items-center p-2 lg:p-0">
          <div className="flex gap-2 lg:hidden">
            <Link
              href="/"
              className="text-white p-3 rounded-lg hover:bg-indigo-500/20 transition"
            >
              <HomeIcon />
            </Link>
            <Link
              href="/filter"
              className="text-white p-3 rounded-lg hover:bg-indigo-500/20 transition"
            >
              <FilmIcon />
            </Link>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              className="p-3 lg:p-5 text-white hover:bg-indigo-500/20 lg:hover:bg-[#5937ef]/20 rounded-lg lg:rounded-none transition"
              onClick={handleOpenSearch}
            >
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>
      {showSearch &&
        createPortal(<Search setShowSearch={setShowSearch} />, document.body)}
    </header>
  );
};

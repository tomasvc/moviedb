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
      <div className="flex flex-col justify-between items-center w-full relative px-4 py-[0.7rem]">
        <div className="w-full flex">
          <div className="flex gap-2 w-full lg:w-1/2 pr-4 lg:pr-0">
            <Link href="/" className="lg:hidden text-white p-2">
              <HomeIcon />
            </Link>
            <Link href="/filter" className="lg:hidden text-white p-2">
              <FilmIcon />
            </Link>
            <button
              className="text-white z-20 mr-6 p-2"
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

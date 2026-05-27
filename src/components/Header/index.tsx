"use client";

import React, { useEffect, useState } from "react";
import { SearchIcon } from "../Icons";
import { Search } from "../Search";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/assets/img/logo.svg";

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedList?: string;
  setState?: (state: any) => void;
};

export const Header = ({
  open,
  setOpen,
  selectedList = "Trending",
  setState = () => {},
}: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [headerStyles, setHeaderStyles] = useState("");
  const pathname = usePathname();

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
      className={`fixed w-full border-b border-slate-600/30 ${
        pathname === "/" ? "bg-slate-900" : "bg-transparent"
      } ${headerStyles} flex transition-all z-40`}
    >
      <div className="flex flex-col justify-between items-center w-full relative px-6 py-4">
        <div className="w-full flex justify-between items-center">
          <nav className="flex items-center gap-10">
            <Link href="/" className="text-white transition shrink-0">
              <Image src={Logo} alt="logo" width={50} height={50} />
            </Link>
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() =>
                  setState?.((prevState: any) => ({
                    ...prevState,
                    selectedList: "Trending",
                  }))
                }
                className="text-white text-xs font-medium w-fit h-fit uppercase transition active:transition-none"
              >
                Trending
              </button>
              <button
                onClick={() =>
                  setState?.((prevState: any) => ({
                    ...prevState,
                    selectedList: "Popular",
                  }))
                }
                className="text-white text-xs font-medium w-fit h-fit uppercase transition active:transition-none"
              >
                Popular
              </button>
              <button
                onClick={() =>
                  setState?.((prevState: any) => ({
                    ...prevState,
                    selectedList: "Upcoming",
                  }))
                }
                className="text-white text-xs font-medium w-fit h-fit uppercase transition active:transition-none"
              >
                Upcoming
              </button>
            </div>
          </nav>
          <div className="flex gap-2 ml-auto">
            <button
              className="text-white transition"
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

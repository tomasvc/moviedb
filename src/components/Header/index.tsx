import React, { useEffect, useState } from "react";
import { SearchIcon } from "../Icons";
import { Search } from "../Search";
import { createPortal } from "react-dom";

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transparent: boolean;
};

export const Header = ({ open, setOpen, transparent }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setOpen(false);
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

  if (typeof window !== "undefined") {
    return (
      <header
        className={`${
          open ? "backdrop-blur-md" : "backdrop-blur-sm"
        } fixed w-full border-b border-slate-600/30 bg-gradient-to-b from-[#0F1827] ${
          transparent ||
          (window?.innerWidth > 500 && !open) ||
          (window?.innerWidth < 500 && !open)
            ? "to-transparent"
            : window?.innerWidth < 500 && open
            ? "to-[#090e17]/80"
            : "to-transparent"
        } flex transition-all pl-0 xl:pl-16 z-40`}
      >
        <div className="flex flex-col justify-between items-center w-full relative px-4 py-[0.7rem]">
          <div className="w-full flex">
            <div className="flex w-full lg:w-1/2 pr-4 lg:pr-0">
              <button
                className="text-white z-20 mr-6 py-2"
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
  } else return null;
};

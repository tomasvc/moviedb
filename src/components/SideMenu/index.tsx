import Link from "next/link";
import { HomeIcon, FilmIcon, HeartIcon, SettingsIcon } from "../Icons";

export const SideMenu: React.FC<{ selected?: string }> = ({ selected }) => {
  return (
    <div className="hidden lg:flex fixed min-h-screen backdrop-blur bg-[#0F1827]/50 z-50 text-white flex-col justify-between">
      <div className="flex flex-col">
        <Link
          href="/"
          className={`p-5 hover:bg-[#5937ef]/20 transition ease-out duration-200 ${
            selected === "home" && "bg-[#5937ef] hover:bg-[#5937ef]"
          }`}
        >
          <HomeIcon />
        </Link>
        <Link
          href="/filter"
          className={`p-5 hover:bg-[#5937ef]/20 transition ease-out duration-200 ${
            selected === "filter" && "bg-[#5937ef] hover:bg-[#5937ef]"
          }`}
        >
          <FilmIcon />
        </Link>
        {/* <Link
          href="/favorites"
          className={`p-5 hover:bg-[#5937ef]/20 transition ease-out duration-200 ${
            selected === "favorites" && "bg-[#5937ef] hover:bg-[#5937ef]"
          }`}
        >
          <HeartIcon />
        </Link> */}
      </div>
      <Link
        href="#"
        className={`p-5 hover:bg-[#5937ef]/20 transition ${
          selected === "settings" && "bg-[#5937ef]"
        }`}
      >
        <SettingsIcon />
      </Link>
    </div>
  );
};

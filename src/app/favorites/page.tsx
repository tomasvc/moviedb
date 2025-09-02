'use client';

import { useState } from "react";
import { MovieItem } from "@/components/MovieItem";
import { Header } from "@/components/Header";
import { useHeaderContext } from "@/contexts/headerContext";
import { SideMenu } from "@/components/SideMenu";
import { signIn, useSession } from "next-auth/react";
import { SearchIcon, PlayIcon } from "@/components/Icons";
import moment from "moment";

export default function Favorites() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(null);
  const { open, setOpen } = useHeaderContext();
  const { data } = useSession();

  return (
    <div className="bg-[#192231] font-roboto">
      <main className="relative flex bg-[#192231] w-full min-h-screen lg:mx-auto transition-all">
        <SideMenu selected="favorites" />
        <div className="w-full">
          <Header open={open} setOpen={setOpen} />
          <div className="w-full mt-28 pl-32 animate-fadeUp flex justify-center">
            {data?.user ? (
              <h1 className="text-2xl text-white">Favorites</h1>
            ) : (
              <h1 className="text-4xl text-white tracking-wider">
                Login to your account so see your favorites.
              </h1>
            )}
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

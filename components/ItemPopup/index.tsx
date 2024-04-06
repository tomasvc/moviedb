import React, { useState, useEffect } from "react";
import { fetchMovieDetails, fetchPersonDetails } from "../../api";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { ItemPopupTypes } from "./types";

export const ItemPopup = ({ id, media_type, visible }: ItemPopupTypes) => {
  const [details, setDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchMovie() {
      setIsLoading(true);
      const movie = await fetchMovieDetails(id);
      setDetails(movie);
      setIsLoading(false);
    }

    if (visible && id) {
      fetchMovie();
    }
  }, [visible]);

  return (
    <Transition
      show={!isLoading}
      enter="transition-opacity transform duration-200"
      enterFrom="opacity-0 translate-y-full"
      enterTo="opacity-100 translate-y-0"
      leave="transition-opacity duration-2000"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="bg-[#263146] w-[300px] rounded-md shadow-lg shadow-gray-900">
        {details?.backdrop_path && (
          <img
            className="rounded-t-md cursor-pointer"
            src={`https://image.tmdb.org/t/p/w400${details?.backdrop_path}`}
            onClick={() => router.push(`/movie/${id}`)}
          />
        )}
        <div className="p-4">
          <p
            className="text-xl mb-2 cursor-pointer w-fit"
            onClick={() => router.push(`/movie/${id}`)}
          >
            {details?.name || details?.original_title || details?.title}
          </p>
          {details?.overview && (
            <p className="font-light">{details?.overview}</p>
          )}
        </div>
      </div>
    </Transition>
  );
};

export default ItemPopup;

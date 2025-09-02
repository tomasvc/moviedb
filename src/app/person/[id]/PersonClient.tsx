'use client';

import { useState } from "react";
import { Header } from "@/components/Header";
import { ItemPopup } from "@/components/ItemPopup";
import { SideMenu } from "@/components/SideMenu";
import { InstagramIcon, ImdbIcon } from "@/components/Icons";
import { useHeaderContext } from "@/contexts/headerContext";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import moment from "moment";

export function PersonClient({
  person,
  externals,
  credits,
  images,
  personId
}: {
  person: any;
  externals: any;
  credits: any;
  images: any;
  personId: string;
}) {
  const { open, setOpen } = useHeaderContext();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  if (!person) {
    return <div>Person not found</div>;
  }

  return (
    <div className="bg-[#192231] font-roboto overflow-x-hidden animate-fadeIn">
      <Header open={open} setOpen={setOpen} />
      <SideMenu />
      <main className={clsx("bg-[#192231] w-full mx-auto transition-all animate-fadeUp", {
        "blur-md": open,
      })}>
        <div className="w-full 2xl:w-2/3 mx-auto px-4 xl:px-10 flex flex-col lg:flex-row text-white pt-24">
          <div className="w-full lg:w-1/3 mb-8">
            <div className="w-full max-w-sm mx-auto lg:mx-0">
              <img
                src={`https://image.tmdb.org/t/p/w400${person.profile_path}`}
                alt={person.name}
                className="rounded-md w-full"
              />
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Personal Info</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold">Known For</h3>
                  <p>{person.known_for_department}</p>
                </div>
                {person.birthday && (
                  <div>
                    <h3 className="font-semibold">Born</h3>
                    <p>{moment(person.birthday).format("MMMM D, YYYY")}</p>
                  </div>
                )}
                {person.place_of_birth && (
                  <div>
                    <h3 className="font-semibold">Place of Birth</h3>
                    <p>{person.place_of_birth}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 lg:pl-10">
            <h1 className="text-4xl font-bold mb-6">{person.name}</h1>
            
            {person.biography && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Biography</h2>
                <p className="text-sm leading-6">{person.biography}</p>
              </div>
            )}
            
            {credits?.cast && credits.cast.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Known For</h2>
                <div className="flex overflow-x-scroll gap-4 pb-4">
                  {credits.cast.slice(0, 10).map((item, index) => (
                    <div
                      key={index}
                      className="min-w-[150px] bg-[#263146] rounded-md cursor-pointer"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full rounded-t-md"
                      />
                      <div className="p-2">
                        <p className="font-semibold text-sm">{item.title || item.name}</p>
                        {item.character && (
                          <p className="text-xs text-gray-400">{item.character}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

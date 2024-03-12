import Suspense, { lazy, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchPersonDetails,
  fetchPersonExternals,
  fetchPersonCombinedCredits,
} from "../api";
import { Header } from "../../components/Header";
import { ItemPopup } from "../../components/ItemPopup";
import { SideMenu } from "../../components/SideMenu";
import { InstagramIcon, ImdbIcon } from "../../components/Icons";
import { useHeaderContext } from "../../contexts/headerContext";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import moment from "moment";

export default function PersonPage() {
  const router = useRouter();
  const { id } = router.query;

  const { open, setOpen } = useHeaderContext();

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [person, setPerson] = useState<any>();
  const [externals, setExternals] = useState<any>();
  const [credits, setCredits] = useState<any>();

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    async function fetchPerson() {
      const data = await fetchPersonDetails(id as string);
      const externals = await fetchPersonExternals(id as string);
      const credits = await fetchPersonCombinedCredits(id as string);

      setPerson(data);
      setExternals(externals);

      const sortedCast = credits?.cast.sort((a: any, b: any) => {
        if (a.release_date === undefined && a.first_air_date === undefined)
          return 1;
        if (b.release_date === undefined && b.first_air_date === undefined)
          return -1;

        const dateA = new Date(a.release_date || a.first_air_date) as any;
        const dateB = new Date(b.release_date || b.first_air_date) as any;

        return dateB - dateA;
      });

      const sortedCrew = credits?.crew.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date) as any;
        const dateB = new Date(b.release_date || b.first_air_date) as any;

        return dateB - dateA;
      });

      setCredits([sortedCast, sortedCrew]);
    }

    if (id) {
      fetchPerson();
    }
  }, [id]);

  return (
    <div className="bg-[#192231] text-gray-100">
      <Header open={open} setOpen={setOpen} />
      <main
        className={clsx("w-full min-h-screen mx-4 lg:mx-auto transition-all", {
          "blur-md": open,
        })}
      >
        <SideMenu />
        <div className="flex gap-8 w-full lg:w-3/4 2xl:w-1/2 mx-auto py-8 pt-20">
          {externals && person && (
            <div className="w-1/4">
              <img
                className="rounded-md shadow-lg"
                src={`https://image.tmdb.org/t/p/w400${person?.profile_path}`}
              />
              <div className="my-8 flex gap-3">
                {externals?.instagram_id && (
                  <a
                    href={`https://instagram.com/${externals?.instagram_id}`}
                    target="__blank"
                    className="text-slate-100"
                  >
                    {<InstagramIcon />}
                  </a>
                )}
                {externals?.imdb_id && (
                  <a
                    href={`https://imdb.com/name/${externals?.imdb_id}`}
                    target="__blank"
                    className="text-slate-100"
                  >
                    {<ImdbIcon />}
                  </a>
                )}
              </div>
              <h2 className="my-4 text-lg font-medium">Personal Info</h2>
              <div className="mb-4 text-sm">
                <label className="font-semibold">Known For</label>
                <p>{person?.known_for_department}</p>
              </div>
              <div className="mb-4 text-sm">
                <label className="font-semibold">Gender</label>
                <p>{person?.gender === 2 ? "Male" : "Female"}</p>
              </div>
              <div className="mb-4 text-sm">
                <label className="font-semibold">Birthday</label>
                <p>{moment(person?.birthday).format("MMMM D, YYYY")}</p>
              </div>
              {person?.deathday && (
                <div className="mb-4 text-sm">
                  <label className="font-semibold">Death day</label>
                  <p>{moment(person?.deathday).format("MMMM DD, YYYY")}</p>
                </div>
              )}
              <div className="mb-4 text-sm">
                <label className="font-semibold">Place of Birth</label>
                <p>{person?.place_of_birth}</p>
              </div>
              {person?.also_known_as?.length > 0 && (
                <div className="mb-4 text-sm">
                  <label className="font-semibold">Also Known As</label>
                  {person?.also_known_as?.map((item, index) => {
                    return <p key={index}>{item}</p>;
                  })}
                </div>
              )}
            </div>
          )}
          <div className="w-3/4">
            {person && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{person?.name}</h1>
                <h2 className="text-xl font-medium mb-2">Biography</h2>
                <div
                  className="font-light"
                  dangerouslySetInnerHTML={{
                    __html: person?.biography.replace(
                      /(?:\r\n|\r|\n)/g,
                      "<br>"
                    ),
                  }}
                />
              </div>
            )}
            <div className="bg-[#212b3d] shadow-lg mt-10 text-sm flex flex-col divide-y divide-slate-600 rounded-sm border border-slate-600">
              {credits &&
                credits[0]?.map((item, index) => {
                  return (
                    <div key={index} className="flex gap-1 p-4">
                      <p>
                        {item.release_date || item.first_air_date
                          ? moment(
                              item.release_date || item.first_air_date
                            ).format("YYYY")
                          : "-"}
                      </p>
                      <div
                        onClick={() => router.push(`/movie/${item.id}`)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        className="relative ml-6 font-medium cursor-pointer"
                      >
                        {item.original_title || item.title || item.name}
                        {hoveredIndex === index && (
                          <Transition
                            show={hoveredIndex === index}
                            enter="transition-opacity duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-2000"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute z-30 cursor-default">
                              <ItemPopup
                                id={
                                  item.media_type === "movie" ? item.id : null
                                }
                                visible={hoveredIndex === index}
                              />
                            </div>
                          </Transition>
                        )}
                      </div>
                      {item.character && (
                        <p className="font-light">as {item.character}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

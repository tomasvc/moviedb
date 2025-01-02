import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchPersonDetails,
  fetchPersonExternals,
  fetchPersonCombinedCredits,
  fetchPersonImages,
} from "../../api";
import { Header } from "../../components/Header";
import { ItemPopup } from "../../components/ItemPopup";
import { SideMenu } from "../../components/SideMenu";
import { InstagramIcon, ImdbIcon } from "../../components/Icons";
import { useHeaderContext } from "../../contexts/headerContext";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import moment from "moment";
import { GetServerSideProps } from "next";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const person = await fetchPersonDetails(id as string);
  const externals = await fetchPersonExternals(id as string);
  const credits = await fetchPersonCombinedCredits(id as string);
  const images = await fetchPersonImages(id as string);
  return {
    props: {
      person,
      externals,
      credits,
      images,
    },
  };
};

export default function PersonPage() {
  const router = useRouter();
  const { id } = router.query;

  const { open, setOpen } = useHeaderContext();

  const [isClient, setIsClient] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [person, setPerson] = useState<any>();
  const [externals, setExternals] = useState<any>();
  const [credits, setCredits] = useState<any>();
  const [images, setImages] = useState<any>();

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchPerson() {
      const data = await fetchPersonDetails(id as string);
      const externals = await fetchPersonExternals(id as string);
      const credits = await fetchPersonCombinedCredits(id as string);
      const images = await fetchPersonImages(id as string);

      setPerson(data);
      setExternals(externals);
      setImages(images.profiles);

      const combinedCredits = [
        ...(credits?.cast || []),
        ...(credits?.crew || []),
      ];

      const birthDate = new Date(person?.birthday).getTime();
      const filteredCombinedCredits = combinedCredits.filter(
        (item: any, index: number, self: any[]) => {
          const itemDate = new Date(
            item.release_date || item.first_air_date || 0
          ).getTime();
          return (
            itemDate >= birthDate &&
            self.findIndex((i) => i.id === item.id) === index
          );
        }
      );

      const sortedCombinedCredits = filteredCombinedCredits.sort(
        (a: any, b: any) => {
          const dateA = new Date(
            a.release_date || a.first_air_date || 0
          ).getTime();
          const dateB = new Date(
            b.release_date || b.first_air_date || 0
          ).getTime();
          return dateB - dateA;
        }
      );

      setCredits(sortedCombinedCredits);
    }

    if (id) {
      fetchPerson();
    }
  }, [id]);

  if (isClient)
    return (
      <div className="bg-[#192231] text-gray-100">
        <Head>
          <title>
            {person?.name} - {person?.known_for_department}
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header open={open} setOpen={setOpen} />
        <main
          className={clsx(
            "w-full min-h-screen px-4 lg:px-0 lg:mx-auto transition-all",
            {
              "blur-md": open,
            }
          )}
        >
          <SideMenu />
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 w-full lg:w-3/4 2xl:w-1/2 mx-auto py-8 pt-20">
            {externals && person && (
              <div className="w-full sm:w-3/4 lg:w-1/4 mx-auto">
                <img
                  className="rounded-md shadow-lg w-1/2 lg:w-full mx-auto lg:mx-0"
                  src={`https://image.tmdb.org/t/p/w400${person?.profile_path}`}
                />
                <div className="my-4 flex gap-3 justify-center lg:justify-left">
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
                <div className="hidden lg:flex flex-col">
                  <h2 className="mb-4 text-lg font-medium">Personal Info</h2>
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
              </div>
            )}
            <div className="w-full lg:w-3/4">
              {person && (
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                    {person?.name}
                  </h1>
                  <h2 className="text-lg lg:text-xl font-medium mb-2">
                    Biography
                  </h2>
                  <div
                    className="font-light text-xs lg:text-sm leading-5 lg:leading-6"
                    dangerouslySetInnerHTML={{
                      __html: person?.biography.replace(
                        /(?:\r\n|\r|\n)/g,
                        "<br>"
                      ),
                    }}
                  />
                </div>
              )}
              {images?.length > 1 && (
                <div className="mt-10">
                  <div className="flex gap-0.5 h-[300px]">
                    <img
                      className="shadow-lg object-cover w-1/3 h-[300px] overflow-hidden"
                      alt="Image one"
                      src={`https://image.tmdb.org/t/p/w400${images[1]?.file_path}`}
                      width="200"
                      height="200"
                    />
                    <div className="grid grid-cols-3 grid-rows-2 gap-0.5 w-2/3">
                      {images?.slice(2, 8).map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="w-full h-full shadow-lg overflow-hidden"
                          >
                            <img
                              className="shadow-lg w-full h-full object-cover"
                              src={`https://image.tmdb.org/t/p/w400${item.file_path}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-[#212b3d] shadow-lg mt-10 text-sm flex flex-col divide-y divide-slate-600 rounded-sm border border-slate-600">
                {credits?.map((item, index) => {
                  return (
                    <div key={index} className="flex items-center gap-1 p-4">
                      <p className="text-xs lg:text-sm">
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
                        className="inline relative ml-6 font-medium cursor-pointer text-xs lg:text-sm leading-5"
                      >
                        {item.original_title || item.title || item.name}
                        {item.character && (
                          <span className="font-light text-xs lg:text-sm">
                            {" "}
                            as {item.character}
                          </span>
                        )}
                        {hoveredIndex === index && window.innerWidth > 500 && (
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

import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { useHeaderContext } from "../../contexts/headerContext";
import { fetchItemsByKeyword, fetchKeyword } from "../../api";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";

export default function Keyword() {
  const { open, setOpen } = useHeaderContext();
  const router = useRouter();
  const { id } = router.query;

  const [results, setResults] = useState<any>();
  const [keyword, setKeyword] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const results = await fetchItemsByKeyword(id as string);
      const keyword = await fetchKeyword(id as string);
      setResults(results);
      setKeyword(keyword);
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="bg-[#192231]-50">
      <Header open={open} setOpen={setOpen} />
      <main className="bg-[#192231] px-20 py-10 pt-20 flex flex-col gap-4 xl:w-1/2 mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-7 bg-blue-400" />
          <h1 className="text-lg font-medium uppercase tracking-wide text-white">
            {keyword?.name}
          </h1>
        </div>
        {results?.results?.map((item, index) => {
          return (
            <Link href={`/movie/${item.id}`}>
              <div
                key={index}
                className="rounded bg-[#263146] flex shadow-md text-white h-44"
              >
                <div className="w-1/6">
                  <img
                    className="rounded-tl rounded-bl w-full h-full"
                    src={`https://image.tmdb.org/t/p/w400${item?.poster_path}`}
                  />
                </div>
                <div className="p-4 flex flex-col w-5/6">
                  <div>
                    <p className="text-xl font-semibold">
                      {item?.title || item?.original_title || item?.name}
                    </p>
                    <p className="text-gray-400 text-sm pb-2">
                      {item?.release_date &&
                        moment(item.release_date).format("MMMM D, YYYY")}
                    </p>
                  </div>
                  {item?.overview && (
                    <p className="text-sm line-clamp-4">{item.overview}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}

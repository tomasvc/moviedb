import React, { useState, useEffect, useLayoutEffect } from "react";
import { Header } from "../../components/Header";
import { useHeaderContext } from "../../contexts/headerContext";
import { fetchItemsByKeyword, fetchKeyword } from "../../api";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { SideMenu } from "@components/SideMenu";
import { BackIcon } from "@components/Icons";
import { Pagination } from "@mui/material";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const results = await fetchItemsByKeyword(id as string, 1);
  const keyword = await fetchKeyword(id as string);
  return {
    props: {
      results,
      keyword,
    },
  };
};

export default function Keyword() {
  const { open, setOpen } = useHeaderContext();
  const router = useRouter();
  const { id } = router.query;

  const [isClient, setIsClient] = useState(false);
  const [results, setResults] = useState<any>();
  const [keyword, setKeyword] = useState<any>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    async function fetchData() {
      const keyword = await fetchKeyword(id as string);
      const results = await fetchItemsByKeyword(keyword.id, page);

      setResults(results);
      setKeyword(keyword);
    }

    if (id) {
      fetchData();
    }
  }, [id, page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  console.log(results);

  const paginatedResults = results?.results;

  if (isClient)
    return (
      <div className="bg-[#192231]-50">
        <SideMenu selected="home" />
        <Header open={open} setOpen={setOpen} transparent={false} />
        <main className="container w-full lg:w-2/3 bg-[#192231] px-4 py-10 pt-20 flex flex-col gap-4 mx-auto">
          <button
            onClick={() => router.back()}
            className="text-blue-400 text-xs font-medium w-fit h-fit rounded-full uppercase transition flex items-center gap-1"
          >
            <BackIcon className="w-4 h-4 mb-0.5" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-7 bg-blue-400" />
            <h1 className="text-lg font-medium uppercase tracking-wide text-white">
              {keyword?.name}
            </h1>
          </div>
          {paginatedResults?.map((item, index) => {
            return (
              <Link href={`/movie/${item.id}`} key={index}>
                <div className="rounded bg-[#263146] flex shadow-md text-white">
                  <div>
                    <Image
                      className="rounded-tl rounded-bl w-full h-full object-cover"
                      src={`https://image.tmdb.org/t/p/w400${item?.poster_path}`}
                      alt={item?.title || item?.original_title || item?.name}
                      width={100}
                      height={150}
                    />
                  </div>
                  <div className="p-4 flex flex-col w-5/6">
                    <div>
                      <p className="text-gray-400 text-xs">
                        {item?.release_date &&
                          moment(item.release_date).format("MMMM D, YYYY")}
                      </p>
                      <p className="text-lg sm:text-xl font-semibold line-clamp-2 mb-2 leading-6">
                        {item?.title || item?.original_title || item?.name}
                      </p>
                    </div>
                    {item?.overview && (
                      <p className="text-xs sm:text-sm line-clamp-4">
                        {item.overview}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
          <Pagination
            count={Math.ceil(results?.total_pages)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
            sx={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: "2rem",
              "& .MuiPagination-ul": {
                gap: "1rem",
              },
              "& .MuiPaginationItem-root": {
                color: "white",
              },
            }}
          />
        </main>
      </div>
    );
}

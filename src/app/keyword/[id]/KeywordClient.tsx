"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useHeaderContext } from "@/contexts/headerContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import { SideMenu } from "@/components/SideMenu";
import { BackIcon } from "@/components/Icons";
import { Pagination } from "@mui/material";

export function KeywordClient({
  initialResults,
  keyword,
}: {
  initialResults: any;
  keyword: any;
}) {
  const { open, setOpen } = useHeaderContext();
  const router = useRouter();

  const [results, setResults] = useState(initialResults);
  const [page, setPage] = useState(1);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <div className="bg-[#192231] font-roboto overflow-x-hidden animate-fadeIn">
      <Header open={open} setOpen={setOpen} />
      <SideMenu />
      <main className="bg-[#192231] w-full mx-auto transition-all animate-fadeUp text-white pt-24">
        <div className="w-full 2xl:w-2/3 mx-auto px-4 xl:px-10">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-700 rounded-full transition"
            >
              <BackIcon className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold">
              Movies with keyword: {keyword?.name}
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results?.results?.map((item: any, index: number) => (
              <Link
                key={index}
                href={`/movie/${item.id}`}
                className="group cursor-pointer"
              >
                <div className="bg-[#263146] rounded-md overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title || item.name}
                    width={300}
                    height={450}
                    className="w-full h-auto"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {item.title || item.name}
                    </h3>
                    {item.release_date && (
                      <p className="text-xs text-gray-400">
                        {moment(item.release_date).format("YYYY")}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {results?.total_pages > 1 && (
            <div className="flex justify-center mt-12 mb-8">
              <Pagination
                count={Math.min(results.total_pages, 500)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                className="text-white"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: { xs: "28px", sm: "32px" },
                    height: { xs: "28px", sm: "32px" },
                  },
                  "& .MuiPaginationItem-page.Mui-selected": {
                    backgroundColor: "#5937ef",
                  },
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

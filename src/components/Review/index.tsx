import React, { useState } from "react";
import moment from "moment";
import { UserIcon, StarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "@/assets/img/logo.svg";

export const Review = ({
  review,
  index,
}: {
  review: any;
  index: number;
}) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const isContentLong = review.content.length > 400;

  const handleClick = () => {};

  return (
    <div
      key={index}
      className="perspective group hover:group w-[400px] h-[400px] flex-shrink-0 transition-transform duration-300 hover:scale-105"
    >
      <div className="preserve-3d w-full h-full mt-2 transition-all duration-300 group-hover:rotate-y-180">
        <div className="flex flex-col w-full h-full bg-gradient-to-b from-[#222D40] to-[#192231] shadow-md relative notched">
          <Image
            src={logo.src}
            alt="logo"
            width={300}
            height={300}
            className="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none"
          />
          <div className="pl-4 mb-auto flex flex-col w-full">
            <div
              className="mt-4 px-2 text-sm prose prose-invert max-h-[300px] overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: review.content.replace(/(?:\r\n|\r|\n)/g, "<br>"),
              }}
            />
          </div>
          <div className="flex flex-row px-2 items-center border-t border-slate-700 border-dashed">
            {/* {review.author_details.avatar_path?.length ? (
              <div className="w-14 h-14 mx-2">
                <img
                  className="rounded-full w-full h-full p-1"
                  src={
                    review.author_details.avatar_path.includes("https")
                      ? review.author_details.avatar_path.slice(1)
                      : `https://image.tmdb.org/t/p/w400${review.author_details.avatar_path}`
                  }
                />
              </div>
            ) : (
              <div className="w-12 h-12 mx-2 p-2 mr-3 bg-slate-500 rounded-full flex items-center justify-center">
                <UserIcon className="rounded-full w-14 h-14 fill-slate-300/80 text-slate-300/60" />
              </div>
            )} */}
            <div className="flex items-center justify-between w-full p-4">
              <div className="flex flex-col text-white">
                <p className="text-sm font-bold">{review.author}</p>
                <p
                  className="text-xs text-white font-light"
                  suppressHydrationWarning
                >
                  {moment(review.created_at).format("MMMM d, YYYY")}
                </p>
              </div>
              {review.author_details.rating && (
                <div className="flex items-center gap-1 bg-slate-900/95 text-yellow-300 text-xs font-medium h-fit px-2 py-1 rounded-md ml-2">
                  <StarIcon className="w-3.5 h-3.5 fill-yellow-300" />
                  <p className="mt-[1px]">{review.author_details.rating}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

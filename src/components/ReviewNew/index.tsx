import React from "react";
import moment from "moment";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Rating } from "@/components/Rating";

export const Review = ({ review, index }: { review: any; index: number }) => {
  return (
    <div
      key={index}
      className="flex flex-col w-full h-full backdrop-blur-sm bg-gradient-to-b from-[#141b26]/80 to-[#0e131c]/80 border border-slate-600/80 rounded-md shadow-md relative p-4"
    >
      {review.author_details.rating && (
        <div className="flex">
          <Rating rating={review.author_details.rating} />
        </div>
      )}
      <div className="mb-auto flex flex-col w-full">
        <div
          className="mt-4 px-2 text-sm prose prose-invert max-h-[200px] sm:max-h-[300px] overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: review.content.replace(/(?:\r\n|\r|\n)/g, "<br>"),
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-4 mt-4 px-2">
        {review.author_details.avatar_path?.length ? (
          <div className="w-10 h-10">
            <Image
              className="rounded-full w-full h-full object-cover"
              src={
                review.author_details.avatar_path.includes("https")
                  ? review.author_details.avatar_path.slice(1)
                  : `https://image.tmdb.org/t/p/w400${review.author_details.avatar_path}`
              }
              width={20}
              height={20}
              alt={review.author}
            />
          </div>
        ) : (
          <div className="w-10 h-10 p-2 bg-slate-500 rounded-full flex items-center justify-center">
            <UserIcon className="rounded-full w-full h-full fill-slate-300/80 text-slate-300/60" />
          </div>
        )}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col text-white">
            <p className="text-sm font-bold">{review.author}</p>
            <p className="text-xs text-white font-light">
              {moment(review.created_at).format("MMMM d, YYYY")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

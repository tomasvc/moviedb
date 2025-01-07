import React, { useState } from "react";
import moment from "moment";
import { UserIcon, StarIcon } from "@heroicons/react/24/outline";

export const Review = ({ review, index }: { review: any; index: number }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const isContentLong = review.content.length > 400;

  return (
    <div
      key={index}
      className="bg-[#263146] shadow-md border border-slate-600 pl-2 pr-10 py-6 mt-2 rounded-lg"
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-row px-2 items-center">
          {review.author_details.avatar_path?.length ? (
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
          )}
          <div>
            <div className="flex items-center">
              <p className="text-base xl:text-xl font-bold">{review.author}</p>
              {review.author_details.rating && (
                <div className="flex items-center gap-1 bg-slate-900/95 text-yellow-300 text-xs font-medium h-fit px-2 py-1 rounded-md ml-2">
                  <StarIcon className="w-3.5 h-3.5 fill-yellow-300" />
                  <p className="mt-[1px]">{review.author_details.rating}</p>
                </div>
              )}
            </div>
            <p
              className="text-sm font-light text-gray-400"
              suppressHydrationWarning
            >
              Written on {moment(review.created_at).format("MMMM d, YYYY")}
            </p>
          </div>
        </div>

        <div className="pl-4 mb-auto flex flex-col w-full">
          <div
            className={`mt-4 text-sm ${
              showFullComment || !isContentLong
                ? "line-clamp-none"
                : "line-clamp-6"
            }`}
            dangerouslySetInnerHTML={{
              __html: review.content.replace(/(?:\r\n|\r|\n)/g, "<br>"),
            }}
          />
          {isContentLong && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="inline w-fit text-sm text-slate-400 hover:text-slate-300/90 mt-4"
            >
              {"Show"}
              {showFullComment || !isContentLong ? " less" : " more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

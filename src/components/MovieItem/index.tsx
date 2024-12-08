"use client";
import moment from "moment";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const MovieItem = ({ poster, name, release }) => {
  const [plaiceholder, setPlaiceholder] = useState<{ base64: string } | null>(
    null
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    const fetchPlaiceholder = async () => {
      if (poster) {
        try {
          const response = await fetch(
            `/api/getPlaceholder?poster=${
              "https://image.tmdb.org/t/p/w400" + poster
            }`
          );
          const plaiceholderData = await response.json();
          setPlaiceholder(plaiceholderData);
        } catch (error) {
          console.error("Failed to fetch placeholder:", error);
        }
      }
    };

    fetchPlaiceholder();
  }, [poster]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col rounded-sm cursor-pointer text-white animate-fadeUp"
    >
      {plaiceholder ? (
        <Image
          src={`https://image.tmdb.org/t/p/w400${poster}`}
          alt={name}
          className="rounded-md shadow-xl"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.2s cubic-bezier(0.3, 0.2, 0.2, 0.8)",
          }}
          width={180}
          height={270}
          placeholder="blur"
          blurDataURL={plaiceholder?.base64 || ""}
          priority
        />
      ) : (
        <div
          style={{ width: 180, height: 270, backgroundColor: "#fafafa20" }}
          className="rounded-md shadow-xl animate-pulse"
        />
      )}

      <div className="mt-3 mr-1 text-left">
        <p className="font-medium text-sm leading-5 uppercase tracking-wide max-w-[180px] truncate">
          {name}
        </p>
        <p className="text-xs mt-1 font-light">
          {moment(release).format("YYYY")}
        </p>
      </div>
    </div>
  );
};

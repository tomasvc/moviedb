import React from "react";

export const HomeHero = ({
  selectedList,
  setState,
}: {
  selectedList: string;
  setState: (state: any) => void;
}) => {
  const selectedClass = "bg-[#5937ef] hover:bg-[#6a49ff] active:bg-[#563bce]";
  return (
    <div
      className="relative w-full mx-auto flex flex-col justify-center items-center gap-1 py-6 mb-6 bg-black/50"
      style={{
        backgroundImage: `url(/images/genres-wallpaper.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: window?.innerWidth > 500 ? "fixed" : "scroll",
        minHeight: "300px",
        width: "100vw",
      }}
    >
      <div className="absolute top-0 left-0 w-screen h-full bg-black/50" />
      <p className="text-white text-5xl font-semibold tracking-wider uppercase mx-auto z-10">
        <span className="text-[#5937ef] font-black relative bottom-0.5">/</span>{" "}
        {selectedList}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 z-10">
        <button
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              selectedList: "Trending",
            }))
          }
          className={`${
            selectedList === "Trending"
              ? selectedClass
              : "bg-[#5937ef]/30 hover:bg-[#6a49ff]/70 active:bg-[#563bce]/70"
          } border border-[#5937ef] text-white text-xs font-medium tracking-wide px-6 py-2.5 w-fit h-fit rounded-full uppercase transition active:transition-none`}
        >
          Trending
        </button>
        <button
          onClick={() =>
            setState((prevState) => ({ ...prevState, selectedList: "Popular" }))
          }
          className={`${
            selectedList === "Popular"
              ? selectedClass
              : "bg-[#5937ef]/30 hover:bg-[#6a49ff]/70 active:bg-[#563bce]/70"
          } border border-[#5937ef]/50 backdrop-blur-sm text-white text-xs font-medium tracking-wide px-6 py-2.5 w-fit h-fit rounded-full uppercase transition active:transition-none`}
        >
          Popular
        </button>
        <button
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              selectedList: "Upcoming",
            }))
          }
          className={`${
            selectedList === "Upcoming"
              ? selectedClass
              : "bg-[#5937ef]/30 hover:bg-[#6a49ff]/70 active:bg-[#563bce]/70"
          } border border-[#5937ef]/50 backdrop-blur-sm text-white text-xs font-medium tracking-wide px-6 py-2.5 w-fit h-fit rounded-full uppercase transition active:transition-none`}
        >
          Upcoming
        </button>
      </div>
    </div>
  );
};

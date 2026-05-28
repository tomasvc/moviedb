"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { XIcon } from "@/components/Icons";
import { Video } from "@/components/Video";
import {
  buildVideoJsOptions,
  getYoutubeVideos,
  pickDefaultVideo,
  type MovieVideo,
} from "@/lib/movieVideos";
import clsx from "clsx";

type MovieVideoModalProps = {
  open: boolean;
  onClose: () => void;
  movieTitle: string;
  backdropPath?: string | null;
  videos: MovieVideo[];
};

export function MovieVideoModal({
  open,
  onClose,
  movieTitle,
  backdropPath,
  videos,
}: MovieVideoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const youtubeVideos = useMemo(() => getYoutubeVideos(videos), [videos]);
  const defaultVideo = useMemo(
    () => pickDefaultVideo(videos),
    [videos],
  );

  const [activeVideo, setActiveVideo] = useState<MovieVideo | null>(null);
  const [playerKey, setPlayerKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setActiveVideo(defaultVideo);
    setPlayerKey((k) => k + 1);
  }, [open, defaultVideo]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const selectVideo = useCallback((video: MovieVideo) => {
    setActiveVideo(video);
    setPlayerKey((k) => k + 1);
  }, []);

  const videoOptions = useMemo(
    () => (activeVideo ? buildVideoJsOptions(activeVideo, true) : null),
    [activeVideo],
  );

  if (!open) return null;

  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
    : null;

  return (
    <div
      className="movie-video-modal fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-video-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        aria-label="Close video"
        onClick={onClose}
      />

      {backdropUrl && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover opacity-25 blur-2xl scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-4 sm:gap-5">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#adff4f]">
              Now playing
            </p>
            <h2
              id="movie-video-modal-title"
              className="mt-1 truncate text-lg font-bold text-white sm:text-2xl"
            >
              {movieTitle}
            </h2>
            {activeVideo?.name && (
              <p className="mt-1 truncate text-sm text-white/60">
                {activeVideo.name}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#adff4f] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close trailer"
          >
            <XIcon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={0.75} />
          </button>
        </header>

        <div
          className="movie-video-player relative w-full overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/80 ring-1 ring-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="aspect-video w-full">
            {videoOptions ? (
              <Video key={playerKey} options={videoOptions} className="h-full" />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-slate-950 px-6 text-center">
                <p className="text-base font-medium text-white">
                  No trailer available
                </p>
                <p className="text-sm text-white/50">
                  This title does not have a YouTube video on TMDB yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {youtubeVideos.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory"
            role="tablist"
            aria-label="Available videos"
            onClick={(e) => e.stopPropagation()}
          >
            {youtubeVideos.map((video) => {
              const isActive = activeVideo?.key === video.key;
              return (
                <button
                  key={video.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectVideo(video)}
                  className={clsx(
                    "snap-start shrink-0 rounded-md border px-3 py-2 text-left text-xs transition min-h-[44px] max-w-[220px]",
                    isActive
                      ? "border-[#adff4f]/60 bg-[#adff4f]/10 text-white"
                      : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className="block font-semibold uppercase tracking-wide text-[10px] text-[#adff4f]">
                    {video.type}
                    {video.official ? " · Official" : ""}
                  </span>
                  <span className="mt-0.5 block truncate font-medium">
                    {video.name || "Untitled"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-center text-[10px] text-white/35 sm:text-xs">
          Press Esc to close · Trailers via YouTube
        </p>
      </div>
    </div>
  );
}

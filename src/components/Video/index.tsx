"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import "videojs-youtube";
import clsx from "clsx";

export type VideoJsOptions = {
  autoplay?: boolean;
  controls?: boolean;
  responsive?: boolean;
  fluid?: boolean;
  techOrder?: string[];
  sources: { src: string; type: string }[];
  youtube?: Record<string, number>;
};

type VideoProps = {
  options: VideoJsOptions;
  className?: string;
  onReady?: (player: Player) => void;
};

export function Video({ options, className, onReady }: VideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-16-9");
    containerRef.current.appendChild(videoElement);

    const player = videojs(videoElement, options, () => {
      onReady?.(player);
    });
    playerRef.current = player;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
      }
      playerRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
    // Re-mount player when sources change (parent uses key for full resets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.sources[0]?.src]);

  return (
    <div
      data-vjs-player
      className={clsx(
        "movie-video-player-inner flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

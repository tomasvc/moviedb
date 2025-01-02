import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

export const Video = (props: any) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  const data = `{"techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "${options.src}" }], "youtube": { "iv_load_policy": 1 }}`;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");
      if (videoRef.current) {
        videoElement.classList.add("vjs-big-play-centered");
        (videoRef.current as HTMLElement).appendChild(videoElement);
      }

      const player = ((playerRef.current as any) = videojs(
        videoElement,
        options,
        () => {
          videojs.log("player is ready");
          onReady && onReady(player);
        }
      ));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current as any;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    return () => {
      const player = playerRef.current as any;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      data-vjs-player
      className="w-full h-full flex justify-center items-center"
    >
      <div
        className="w-[100vw] h-[60vh] xl:w-[50vw] xl:h-[50vh] flex justify-center items-center"
        ref={videoRef}
      />
    </div>
  );
};

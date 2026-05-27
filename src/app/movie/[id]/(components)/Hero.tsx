import { Credits, Movie, MovieImage, MovieImagesResponse } from "@/types/api";
import Image from "next/image";
import TMDBLogo from "@/assets/img/tmdb.svg";
import { useRef, useMemo } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import moment from "moment";

// Only register GSAP plugins on the client side
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
    CustomEase.create(
      "hop",
      "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
    );
  }

export const Hero = ({ movie, images, credits }: { movie: Movie, images: MovieImagesResponse, credits: Credits }) => {
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageTextRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  const carouselImagesRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const carouselSlides = useMemo(() => {
    const slides: { image: string; id: string }[] = [];

    // Add movie backdrop first so it loads as the initial image
    if (movie?.backdrop_path) {
      slides.push({
        image: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        id: `movie-backdrop-${movie.id}`,
      });
    }

    // Add additional high-quality backdrops from the images API
    images?.backdrops
      ?.filter((image: MovieImage) => image.height >= 1080)
      .forEach((image: MovieImage, index: number) => {
        slides.push({
          image: `https://image.tmdb.org/t/p/original${image.file_path}`,
          id: `movie-backdrop-${index}`,
        });
      });

    return slides;
  }, [movie?.backdrop_path, movie?.id, images?.backdrops]);

  const handleNext = () => {
    if (isAnimatingRef.current || carouselSlides.length === 0) return;
    currentIndexRef.current =
      (currentIndexRef.current + 1) % carouselSlides.length;
    animateSlide("right");
  };

  const handlePrev = () => {
    if (isAnimatingRef.current || carouselSlides.length === 0) return;
    currentIndexRef.current =
      (currentIndexRef.current - 1 + carouselSlides.length) %
      carouselSlides.length;
    animateSlide("left");
  };

  const { contextSafe } = useGSAP(
    () => {
      // Ensure we're on the client and container exists
      if (typeof window === "undefined") return;

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          x: 200,
          duration: 15,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (imageMaskRef.current) {
        gsap.fromTo(
          imageMaskRef.current,
          { height: 0 },
          {
            height: 375,
            duration: 2,
            delay: 0.2,
            ease: "power3.out",
          }
        );
      }

    //   const scrollContainer = containerRef.current;
    //   const sections = scrollContainer.querySelectorAll(".snap-section");

    //   sections.forEach((section, index) => {
    //     if (index === 0) return; // Skip hero section

    //     const sectionContent = section.querySelector(".section-content");
    //     if (!sectionContent) return; // Skip if no .section-content found

    //     gsap.fromTo(
    //       sectionContent,
    //       { opacity: 0, y: 50 },
    //       {
    //         opacity: 1,
    //         y: 0,
    //         duration: 0.8,
    //         ease: "power2.out",
    //         scrollTrigger: {
    //           trigger: section,
    //           scroller: scrollContainer,
    //           start: "top 80%",
    //           toggleActions: "play none none reverse",
    //         },
    //       }
    //     );
    //   });
    },
    {
    //   scope: containerRef,
      dependencies: [],
    }
  );

  const animateSlide = contextSafe((direction: "left" | "right") => {
    if (isAnimatingRef.current || !carouselImagesRef.current) return;
    isAnimatingRef.current = true;

    const viewportWidth = window.innerWidth;
    const slideOffset = Math.min(viewportWidth * 0.5, 500);

    const currentSlide =
      carouselImagesRef.current.querySelector(".img:last-child");
    const currentSlideImage = currentSlide?.querySelector("img");

    const newSlideContainer = document.createElement("div");
    newSlideContainer.classList.add("img");

    const newSlideImg = document.createElement("img");
    newSlideImg.src = carouselSlides[currentIndexRef.current]?.image || "";
    newSlideImg.alt = movie?.title || "Movie backdrop";

    gsap.set(newSlideImg, {
      x: direction === "left" ? -slideOffset : slideOffset,
    });

    newSlideContainer.appendChild(newSlideImg);
    carouselImagesRef.current.appendChild(newSlideContainer);

    gsap.to(currentSlideImage as HTMLElement, {
      x: direction === "left" ? slideOffset : -slideOffset,
      duration: 1.5,
      ease: "hop",
    });

    gsap.fromTo(
      newSlideContainer,
      {
        clipPath:
          direction === "left"
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
        onComplete: () => {
          const imgContainers =
            carouselImagesRef.current?.querySelectorAll(".img");
          if (imgContainers && imgContainers.length > 1) {
            for (let i = 0; i < imgContainers.length - 1; i++) {
              imgContainers[i].remove();
            }
          }
          isAnimatingRef.current = false;
        },
      }
    );

    gsap.to(newSlideImg, {
      x: 0,
      duration: 1.5,
      ease: "hop",
    });
  });

  return (
    <section className="snap-section snap-start h-screen w-screen relative flex items-center">
          <div className="section-content relative flex flex-col gap-2 z-30 w-full h-full mx-auto pb-12 px-6">
            <div className="h-auto flex gap-6 mt-20">
              <div
                ref={imageMaskRef}
                className="overflow-hidden h-0 flex-shrink-0"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w400${movie?.poster_path}`}
                  alt={
                    movie?.title || movie?.name || movie?.original_title || ""
                  }
                  width={250}
                  height={375}
                  className="block h-[375px] min-h-[375px]"
                />
              </div>
              <div className="my-4 text-white w-full lg:w-2/3 flex flex-col justify-between">
                <div>
                  <h2 className="2xl:text-xl italic text-slate-300 max-w-xs">
                    {movie?.tagline}
                  </h2>
                  <p
                    ref={imageTextRef}
                    className="mt-4 font-light leading-6 lg:leading-7 text-sm lg:text-base max-w-xs"
                  >
                    {movie?.overview}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center absolute top-20 right-8">
              <Image src={TMDBLogo} alt="TMDB Logo" width={40} height={40} />
              <p className="text-white text-sm font-bold mt-1">
                {movie?.vote_average?.toFixed(1)} / 10
              </p>
              <p className="text-white text-xs">{movie?.vote_count}</p>
            </div>
            <div className="relative w-full mt-32">
              <h1 className="text-white font-bold uppercase text-3xl lg:text-[70px] flex items-center justify-center gap-4 mx-auto select-none">
                {movie?.title || movie?.name || movie?.original_title}
              </h1>
              <span
                ref={titleRef}
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white/5 font-black uppercase text-[300px] whitespace-nowrap select-none"
              >
                {movie?.title || movie?.name || movie?.original_title}
              </span>
            </div>
            <div className="flex gap-4 justify-center mt-6 z-50">
              <button
                onClick={handlePrev}
                className="prev-btn text-white px-4 py-2 flex gap-2 items-center"
              >
                <MoveLeft />
                prev
              </button>
              <button
                onClick={handleNext}
                className="next-btn text-white px-4 py-2 flex gap-2 items-center"
              >
                next
                <MoveRight />
              </button>
            </div>
            <div className="fixed bottom-10 left-6 w-full mt-auto">
              <p
                className="font-medium text-white text-2xl uppercase tracking-tighter"
                suppressHydrationWarning
              >
                {moment(movie?.release_date).format("YYYY")}
              </p>
              <div className="flex items-center flex-row flex-wrap gap-2 mt-4 text-xs text-[#adff4f]">
                {movie?.production_companies
                  ?.filter((item: any) => item.logo_path)
                  ?.map((item: any) => item.name)
                  .join(" / ") && (
                  <span>
                    {movie?.production_companies
                      ?.filter((item: any) => item.logo_path)
                      ?.map((item: any) => item.name)
                      .join(" / ")}
                  </span>
                )}
                <span className="w-[50px] h-[1px] bg-white mx-1"></span>
                <span className="text-white text-xs">
                  Directed by{" "}
                  <span className="text-[#adff4f]">
                    {credits?.crew
                      ?.filter((item: any) => item.job === "Director")
                      .map((item: any) => item.name)
                      .join(", ")}
                  </span>
                </span>
              </div>
              <div className="flex items-center flex-row flex-wrap gap-6 mt-2">
                {credits?.cast?.slice(0, 5).map((item: any, index: number) => (
                  <span key={index} className="text-white text-xs">
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
  );
};
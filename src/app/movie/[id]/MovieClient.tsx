"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { MovieItem } from "@/components/MovieItemNew";
import { useHeaderContext } from "@/contexts/headerContext";
import clsx from "clsx";
import moment from "moment";
import { Review } from "@/components/ReviewNew";
import Image from "next/image";
import { Movie, Credits, MovieImagesResponse, MovieImage } from "@/types/api";
import { MoveLeft, MoveRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import TMDBLogo from "@/assets/img/tmdb.svg";
import { Carousel3D } from "@/components/Carousel3D";
import { Slide } from "@/components/Carousel3D/Slide";
import { Carousel2D } from "@components/Carousel2D";

// Only register GSAP plugins on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  CustomEase.create(
    "hop",
    "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1",
  );
}

function getPosterHeight(width: number) {
  if (width < 640) return 210;
  if (width < 1024) return 300;
  return 375;
}

function getPosterWidth(height: number) {
  return Math.round((height * 2) / 3);
}

export function MovieClient({
  movieId,
  movie,
  credits,
  reviews,
  keywords,
  recommendations,
  images,
}: {
  movieId: string;
  movie: Movie;
  credits: Credits;
  reviews: any[];
  keywords: any[];
  recommendations: any[];
  images: MovieImagesResponse;
}) {
  const router = useRouter();

  const { open, setOpen } = useHeaderContext();
  const [posterHeight, setPosterHeight] = useState(375);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageTextRef = useRef<HTMLParagraphElement>(null);
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

  // Preload all carousel images in the background
  useEffect(() => {
    if (carouselSlides.length === 0) return;

    const preloadedImages: HTMLImageElement[] = [];

    carouselSlides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
      preloadedImages.push(img);
    });

    // Cleanup function to prevent memory leaks
    return () => {
      preloadedImages.forEach((img) => {
        img.src = "";
      });
    };
  }, [carouselSlides]);

  useLayoutEffect(() => {
    const updateViewport = () => {
      setPosterHeight(getPosterHeight(window.innerWidth));
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      // Ensure we're on the client and container exists
      if (typeof window === "undefined" || !containerRef.current) return;

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
            height: posterHeight,
            duration: 2,
            delay: 0.2,
            ease: "power3.out",
          },
        );
      }

      const scrollContainer = containerRef.current;
      const sections = scrollContainer.querySelectorAll(".snap-section");

      sections.forEach((section, index) => {
        if (index === 0) return; // Skip hero section

        const sectionContent = section.querySelector(".section-content");
        if (!sectionContent) return; // Skip if no .section-content found

        gsap.fromTo(
          sectionContent,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              scroller: scrollContainer,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    },
    {
      scope: containerRef,
      dependencies: [posterHeight],
    },
  );

  useEffect(() => {
    if (carouselSlides.length > 0 && carouselImagesRef.current) {
      // Clear any existing slides
      carouselImagesRef.current.innerHTML = "";

      // Create initial slide
      const initialSlideContainer = document.createElement("div");
      initialSlideContainer.classList.add("img");

      const initialSlideImg = document.createElement("img");
      initialSlideImg.src = carouselSlides[0].image;
      initialSlideImg.alt = movie?.title || "Movie backdrop";

      initialSlideContainer.appendChild(initialSlideImg);
      carouselImagesRef.current.appendChild(initialSlideContainer);

      // Reset index when slides change
      currentIndexRef.current = 0;
    }
  }, [carouselSlides, movie?.title]);

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

    // Animate current slide out
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
      },
    );

    gsap.to(newSlideImg, {
      x: 0,
      duration: 1.5,
      ease: "hop",
    });
  });

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current || carouselSlides.length === 0) return;
    currentIndexRef.current =
      (currentIndexRef.current + 1) % carouselSlides.length;
    animateSlide("right");
  }, [carouselSlides.length, animateSlide]);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current || carouselSlides.length === 0) return;
    currentIndexRef.current =
      (currentIndexRef.current - 1 + carouselSlides.length) %
      carouselSlides.length;
    animateSlide("left");
  }, [carouselSlides.length, animateSlide]);

  const posterWidth = getPosterWidth(posterHeight);

  return (
    <div
      key={movieId}
      ref={containerRef}
      className="h-[100dvh] overflow-y-auto overflow-x-hidden scroll-smooth animate-fadeIn md:h-screen md:snap-y md:snap-mandatory"
      id="movie-container"
      suppressHydrationWarning
    >
      <Header open={open} setOpen={setOpen} />
      <main
        className={clsx(
          "relative w-full mx-auto transition-all animate-fadeUp",
          {
            "blur-md": open,
          },
        )}
      >
        <div className="carousel fixed inset-0 z-0">
          <div
            ref={carouselImagesRef}
            className="carousel-images w-full h-full"
          />
        </div>
        <div className="fixed inset-0 bg-black/50 z-20 pointer-events-none" />
        {/* Hero Section */}
        <section className="snap-section md:snap-start min-h-[100dvh] md:min-h-0 md:h-screen w-full max-w-full relative flex items-start md:items-center">
          <div className="section-content relative flex flex-col gap-3 z-30 w-full min-h-[100dvh] md:h-full mx-auto pb-8 md:pb-12 px-4 sm:px-6">
            <div className="flex items-start justify-between gap-3 pt-20 sm:pt-24 md:pt-20">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1 min-w-0">
                <div
                  ref={imageMaskRef}
                  className="overflow-hidden h-0 flex-shrink-0 mx-auto sm:mx-0"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w400${movie?.poster_path}`}
                    alt={
                      movie?.title ||
                      movie?.name ||
                      movie?.original_title ||
                      ""
                    }
                    width={posterWidth}
                    height={posterHeight}
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 200px, 250px"
                    className="block w-auto"
                    style={{
                      height: posterHeight,
                      minHeight: posterHeight,
                    }}
                  />
                </div>
                <div className="text-white w-full sm:flex-1 lg:w-2/3 flex flex-col justify-between min-w-0">
                  <div>
                    {movie?.tagline && (
                      <h2 className="text-sm sm:text-base 2xl:text-xl italic text-slate-300">
                        {movie?.tagline}
                      </h2>
                    )}
                    <p
                      ref={imageTextRef}
                      className="mt-2 sm:mt-4 font-light leading-relaxed text-sm sm:text-base lg:leading-7 line-clamp-6 sm:line-clamp-none"
                    >
                      {movie?.overview}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <Image src={TMDBLogo} alt="TMDB Logo" width={32} height={32} className="sm:w-10 sm:h-10" />
                <p className="text-white text-xs sm:text-sm font-bold mt-1">
                  {movie?.vote_average?.toFixed(1)} / 10
                </p>
                <p className="text-white text-[10px] sm:text-xs">
                  {movie?.vote_count}
                </p>
              </div>
            </div>
            <div className="relative w-full mt-6 sm:mt-12 md:mt-24 lg:mt-32 px-1">
              <h1 className="text-white font-bold uppercase text-2xl sm:text-3xl md:text-5xl lg:text-[70px] text-center leading-tight mx-auto select-none break-words">
                {movie?.title || movie?.name || movie?.original_title}
              </h1>
              <span
                ref={titleRef}
                aria-hidden
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white/5 font-black uppercase text-[4.5rem] sm:text-[8rem] md:text-[12rem] lg:text-[300px] whitespace-nowrap select-none max-w-[100vw] overflow-hidden"
              >
                {movie?.title || movie?.name || movie?.original_title}
              </span>
            </div>
            <div className="flex gap-3 sm:gap-4 justify-center mt-4 sm:mt-6 z-50">
              <button
                type="button"
                onClick={handlePrev}
                className="prev-btn text-white px-3 sm:px-4 py-2 flex gap-2 items-center text-sm sm:text-base min-h-[44px]"
              >
                <MoveLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="next-btn text-white px-3 sm:px-4 py-2 flex gap-2 items-center text-sm sm:text-base min-h-[44px]"
              >
                next
                <MoveRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <div className="relative md:fixed md:bottom-10 md:left-6 w-full mt-6 md:mt-auto pr-4 md:pr-8">
              <p
                className="font-medium text-white text-xl sm:text-2xl uppercase tracking-tighter"
                suppressHydrationWarning
              >
                {moment(movie?.release_date).format("YYYY")}
              </p>
              <div className="flex items-center flex-row flex-wrap gap-x-2 gap-y-1 mt-3 sm:mt-4 text-xs text-[#adff4f]">
                {movie?.production_companies
                  ?.filter((item: any) => item.logo_path)
                  ?.map((item: any) => item.name)
                  .join(" / ") && (
                  <span className="line-clamp-2">
                    {movie?.production_companies
                      ?.filter((item: any) => item.logo_path)
                      ?.map((item: any) => item.name)
                      .join(" / ")}
                  </span>
                )}
                <span className="hidden sm:inline w-[50px] h-px bg-white mx-1 shrink-0" />
                <span className="text-white text-xs w-full sm:w-auto">
                  Directed by{" "}
                  <span className="text-[#adff4f]">
                    {credits?.crew
                      ?.filter((item: any) => item.job === "Director")
                      .map((item: any) => item.name)
                      .join(", ")}
                  </span>
                </span>
              </div>
              <div className="flex items-center flex-row flex-wrap gap-x-4 gap-y-1 sm:gap-6 mt-2">
                {credits?.cast?.slice(0, 5).map((item: any, index: number) => (
                  <span key={index} className="text-white text-xs">
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cast Section */}
        <section className="snap-section md:snap-start min-h-[80dvh] md:min-h-screen w-full max-w-full relative flex items-center z-50 py-8 md:py-0">
          <div className="section-content w-full mx-auto px-2 sm:px-6 py-8 sm:py-12 md:py-16">
            {/* <div
              ref={castItemsContainerRef}
              className="flex gap-2 xl:gap-4 overflow-auto py-4"
            >
              {credits?.cast?.slice(0, 10).map((item, index) => {
                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/person/${item.id}`)}
                    className="cast-item relative shadow-lg cursor-pointer"
                  >
                    <div className="relative w-[200px]">
                      <Image
                        className="w-full rounded-t-md"
                        src={`https://image.tmdb.org/t/p/w400${item.profile_path}`}
                        alt={item.name}
                        width={400}
                        height={600}
                      />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-xs xl:text-base text-white text-center">
                      <p className="font-bold uppercase">{item.name}</p>
                      <p className="text-xs xl:text-sm">{item.character}</p>
                    </div>
                  </div>
                );
              })}
            </div> */}
            <Carousel3D>
              {credits?.cast?.slice(0, 10).map((item, index) => {
                return (
                  <Slide
                    key={index}
                    image={`https://image.tmdb.org/t/p/w400${item.profile_path}`}
                    title={item.name}
                    tag={item.character}
                  />
                );
              })}
            </Carousel3D>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="snap-section md:snap-start min-h-[60dvh] md:min-h-screen w-full max-w-full relative flex items-center z-30">
          {reviews?.length > 0 ? (
            <Carousel2D>
              {reviews?.map((review: any, index: number) => (
                <Review key={index} review={review} index={index} />
              ))}
            </Carousel2D>
          ) : (
            <div className="section-content w-full px-4 sm:px-6 py-12 text-white/60 text-sm">
              No reviews yet.
            </div>
          )}
        </section>

        {/* Recommendations Section */}
        <section className="snap-section md:snap-start min-h-[80dvh] md:min-h-screen w-full max-w-full relative flex items-start md:items-center z-30 py-8 md:py-0">
          <div className="section-content w-full mx-auto">
            {recommendations?.length > 0 && (
              <>
                <p className="font-semibold uppercase tracking-wide text-white text-sm px-4 sm:px-6 mb-3">
                  More like this
                </p>
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-4 px-4 sm:px-6 snap-x snap-mandatory touch-pan-x">
                  {recommendations?.map((item: any, index: number) => (
                    <Link
                      href={`/movie/${item.id}`}
                      className="min-w-[120px] sm:min-w-[150px] snap-start shrink-0"
                      key={index}
                      prefetch={true}
                    >
                      <MovieItem movie={item} />
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Movie Details */}
            <div className="flex flex-col gap-6 sm:gap-8 mt-6 sm:mt-8">
              {keywords?.length > 0 && (
                <div className="mx-4 sm:mx-6">
                  <p className="font-semibold uppercase tracking-wide text-white text-sm mb-2">
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-4 max-w-[800px]">
                    {keywords?.map((item: any, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => router.push(`/keyword/${item.id}`)}
                        className="text-xs text-white w-fit min-h-[44px] flex items-center"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 lg:gap-12 text-sm text-white mx-4 sm:mx-6">
                <div>
                  <label className="font-semibold text-xs sm:text-sm uppercase">
                    Status
                  </label>
                  <p className="text-xs pt-1 sm:pt-2">{movie?.status}</p>
                </div>
                {movie?.runtime && movie?.runtime > 0 && (
                  <div>
                    <label className="font-semibold text-xs sm:text-sm uppercase">
                      Runtime
                    </label>
                    <p className="text-xs pt-1 sm:pt-2">
                      {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
                    </p>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-xs sm:text-sm uppercase">
                    Budget
                  </label>
                  <p className="text-xs pt-1 sm:pt-2 break-words">
                    {movie?.budget && movie?.budget > 0
                      ? `$${movie?.budget.toLocaleString()}`
                      : "Not available"}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-xs sm:text-sm uppercase">
                    Revenue
                  </label>
                  <p className="text-xs pt-1 sm:pt-2 break-words">
                    {movie?.revenue && movie?.revenue > 0
                      ? `$${movie?.revenue.toLocaleString()}`
                      : "Not available"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 text-sm text-white mx-4 sm:mx-6 pb-8 md:pb-12">
                <label className="font-semibold text-xs sm:text-sm uppercase">
                  Original language
                </label>
                <p className="text-xs">
                  {movie?.spoken_languages?.[0]?.name}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

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
  const [isFixed, setIsFixed] = useState(false);

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
    setIsFixed(window?.innerWidth > 500);
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
            height: 375,
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
      dependencies: [],
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

  const backgroundAttachment = isFixed ? "fixed" : "scroll";

  return (
    <div
      key={movieId}
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth animate-fadeIn"
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

        {/* Cast Section */}
        <section className="snap-section snap-start min-h-screen w-screen relative flex items-center z-50">
          <div className="section-content w-full mx-auto px-6 py-16">
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
        <section className="snap-section snap-start min-h-screen w-screen relative flex items-center z-30">
          {reviews?.length > 0 && (
            <Carousel2D>
              {reviews?.map((review: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="snap-center shrink-0 w-[min(400px,85vw)]"
                  >
                    <Review review={review} index={index} />
                  </div>
                );
              })}
            </Carousel2D>
          )}
        </section>

        {/* Recommendations Section */}
        <section className="snap-section snap-start min-h-screen w-screen relative flex items-center z-30">
          <div className="section-content w-full mx-auto">
            <div className="flex overflow-x-scroll pb-4">
              {recommendations?.map((item: any, index: number) => {
                return (
                  <Link
                    href={`/movie/${item.id}`}
                    className="min-w-[150px]"
                    key={index}
                    prefetch={true}
                  >
                    <MovieItem movie={item} />
                  </Link>
                );
              })}
            </div>

            {/* Movie Details */}
            <div className="flex flex-col gap-8">
              <div className="mt-8 mx-6">
                <div className="flex gap-3 mb-2">
                  <p className="font-semibold uppercase tracking-wide text-white text-sm">
                    Keywords
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 max-w-[800px]">
                  {keywords?.map((item: any, index: number) => {
                    return (
                      <button
                        key={index}
                        onClick={() => router.push(`/keyword/${item.id}`)}
                        className="text-xs text-white w-fit"
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-12 text-sm text-white mx-6">
                <div>
                  <label className="font-semibold text-sm uppercase">
                    Status
                  </label>
                  <p className="text-xs pt-2">{movie?.status}</p>
                </div>
                {movie?.runtime && movie?.runtime > 0 && (
                  <div>
                    <label className="font-semibold text-sm uppercase">
                      Runtime
                    </label>
                    <p className="text-xs pt-2">
                      {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
                    </p>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-sm uppercase">
                    Budget
                  </label>
                  <p className="text-xs pt-2">
                    {movie?.budget && movie?.budget > 0
                      ? `$${movie?.budget.toLocaleString()}`
                      : "Not available"}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-sm uppercase">
                    Revenue
                  </label>
                  <p className="text-xs pt-2">
                    {movie?.revenue && movie?.revenue > 0
                      ? `$${movie?.revenue.toLocaleString()}`
                      : "Not available"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-white mx-6">
                <label className="font-semibold text-sm uppercase">
                  Original language
                </label>
                <p className="text-xs">{movie?.spoken_languages?.[0]?.name}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

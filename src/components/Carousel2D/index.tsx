import { Children, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Carousel2D = ({ children }: React.PropsWithChildren) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const items = Children.toArray(children);
  if (items.length === 0) return null;

  return (
    <div className="section-content w-full mx-auto py-8 sm:py-12 md:py-16">
      <h2 className="text-white text-sm sm:text-base font-semibold uppercase tracking-wide px-4 sm:px-6 mb-4">
        Reviews
      </h2>
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="Previous review"
          className="absolute left-1 sm:left-2 top-1/2 z-10 hidden sm:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth px-4 sm:px-6 pb-2 -mx-0 touch-pan-x"
        >
          {items.map((child, index) => (
            <div
              key={index}
              className="snap-center shrink-0 w-[min(400px,calc(100vw-2rem))] sm:w-[min(400px,85vw)]"
            >
              {child}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Next review"
          className="absolute right-1 sm:right-2 top-1/2 z-10 hidden sm:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

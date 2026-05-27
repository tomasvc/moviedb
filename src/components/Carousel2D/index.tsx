import { Children, useRef } from "react";

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

  return (
    <section className="...">
      <div className="relative">
        <button onClick={() => scrollBy("left")} aria-label="Previous review">
          …
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth px-6"
        >
          {Children.toArray(children).map((child, index) => (
            <div
              key={index}
              className="snap-center shrink-0 w-[min(400px,85vw)]"
            >
              {child}
            </div>
          ))}
        </div>
        <button onClick={() => scrollBy("right")} aria-label="Next review">
          …
        </button>
      </div>
    </section>
  );
};

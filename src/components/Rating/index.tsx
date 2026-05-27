import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const TOTAL_STARS = 5;

export const Rating = ({ rating }: { rating: number }) => {
  const filledStars = Math.min(
    TOTAL_STARS,
    Math.max(0, Math.round(rating / 2)),
  );

  return (
    <div className="flex items-center gap-1 text-yellow-300 text-xs font-medium h-fit">
      {Array.from({ length: TOTAL_STARS }, (_, index) =>
        index < filledStars ? (
          <StarSolidIcon key={index} className="w-3.5 h-3.5 text-yellow-300" />
        ) : (
          <StarOutlineIcon key={index} className="w-3.5 h-3.5 text-slate-500" />
        ),
      )}
      <p className="mt-[1px] text-white">
        {filledStars}/{TOTAL_STARS}
      </p>
    </div>
  );
};

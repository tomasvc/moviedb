import Image from "next/image";

type SlideProps = {
  image: string;
  title: string;
  tag?: string;
};

export function Slide({ image, title, tag }: SlideProps) {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Image src={image} alt={title} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white pr-2">
        <h3 className="text-sm sm:text-lg font-semibold line-clamp-2">{title}</h3>
        {tag && (
          <span className="text-[10px] sm:text-xs bg-white/20 px-2 py-0.5 sm:py-1 rounded line-clamp-1">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}

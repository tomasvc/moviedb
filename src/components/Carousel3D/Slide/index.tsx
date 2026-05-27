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
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        {tag && (
          <span className="text-xs bg-white/20 px-2 py-1 rounded">{tag}</span>
        )}
      </div>
    </div>
  );
}

import type { StoreItem } from "@/models/StoreItem";
import LazyImage from "@/components/Layout/LazyImage";
import PriceTag from "./PriceTag";

export default function StoreCapsule({ item }: { item: StoreItem }) {
  return (
    <a
      href={`https://www.themoviedb.org/movie/${item.id}`}
      target="_blank" rel="noopener noreferrer"
      className="block bg-black/25 transition duration-200
        hover:-translate-y-0.5 hover:bg-[#3d5a73]/60 hover:shadow-lg
        active:translate-y-0 active:bg-[#3d5a73]/80
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steam-blue"
    >
      <LazyImage src={item.backdrop("w300") || item.poster("w185")} alt="" className="aspect-[231/87] w-full" />
      <span className="block p-2">
        <span className="block truncate text-sm text-white">{item.title}</span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-steam-muted">{item.tags[0] ?? "Movie"}</span>
          <PriceTag item={item} />
        </span>
      </span>
    </a>
  );
}
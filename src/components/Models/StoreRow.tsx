import type { StoreItem } from "@/models/StoreItem";
import LazyImage from "@/components/Layout/LazyImage";
import PriceTag from "./PriceTag";

export default function StoreRow({ item }: { item: StoreItem }) {
  return (
    <a href={`https://www.themoviedb.org/movie/${item.id}`} target="_blank" rel="noopener noreferrer"
      className="grid grid-cols-[184px_1fr_auto] items-center gap-3 bg-black/25 p-1 transition
        hover:bg-[#3d5a73]/60 active:bg-[#3d5a73]/80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-steam-blue">
      <LazyImage src={item.backdrop("w300") || item.poster("w185")} alt="" className="h-[69px] w-[184px]" />
      <span className="min-w-0">
        <span className="block truncate text-[15px] text-white">{item.title}</span>
        <span className="block truncate text-xs text-steam-muted">{item.tags.join(", ")}</span>
        <span className="block text-xs text-steam-muted">Released: {item.releaseLabel}</span>
      </span>
      <PriceTag item={item} tone="sale" />
    </a>
  );
}
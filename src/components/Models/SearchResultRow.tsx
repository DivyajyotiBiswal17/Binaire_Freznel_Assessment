import type { StoreItem } from "@/models/StoreItem";
import LazyImage from "@/components/Layout/LazyImage";
import PlatformIcons from "./PlatformIcons";
import ReviewIcon from "./ReviewIcon";
import PriceTag from "./PriceTag";

export default function SearchResultRow({ item }: { item: StoreItem }) {
  return (
    <a href={`https://www.themoviedb.org/movie/${item.id}`} target="_blank" rel="noopener noreferrer"
      className="group flex h-[70px] items-stretch bg-[#0e1722]/85 transition-colors
        hover:bg-[#2a475e] active:bg-[#1f3a52]
        focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-steam-blue">
      <LazyImage src={item.backdrop("w300") || item.poster("w185")} alt="" className="h-[70px] w-[110px] shrink-0 sm:w-[186px]" />

      <span className="flex min-w-0 flex-1 flex-col justify-between px-[10px] py-[10px]">
        <span className="truncate text-base leading-5 text-[#c7d5e0] transition-colors group-hover:text-white">{item.title}</span>
        <PlatformIcons id={item.id} />
      </span>

      <span className="mb-[10px] hidden items-end gap-2 self-end text-[13px] text-[#7b8996] md:flex">
        <span>{item.releasedLong}</span>
        <ReviewIcon item={item} />
      </span>

      <span className="flex w-[110px] shrink-0 items-center justify-end pr-[7px] md:w-[177px]">
        <PriceTag item={item} />
      </span>
    </a>
  );
}
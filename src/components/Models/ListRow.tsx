import type { ReactNode } from "react";
import type { StoreItem } from "@/models/StoreItem";
import LazyImage from "@/components/Layout/LazyImage";

export default function ListRow({ item, children }: { item: StoreItem; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-3 bg-black/25 p-2 sm:grid-cols-[184px_1fr_auto]">
      <a href={`https://www.themoviedb.org/movie/${item.id}`} target="_blank" rel="noopener noreferrer"
        aria-label={`${item.title} (opens TMDB)`}
        className="block focus-visible:outline-2 focus-visible:outline-steam-blue">
        <LazyImage src={item.backdrop("w300") || item.poster("w185")} alt="" className="h-[45px] w-[120px] sm:h-[69px] sm:w-[184px]" />
      </a>
      <div className="min-w-0">
        <p className="truncate text-[15px] text-white">{item.title}</p>
        <p className="truncate text-xs text-steam-muted">{item.tags.join(", ")}</p>
        <p className="text-xs text-steam-muted">Released: {item.releaseLabel}</p>
      </div>
      <div className="col-span-2 flex items-center justify-end gap-3 sm:col-span-1">{children}</div>
    </div>
  );
}
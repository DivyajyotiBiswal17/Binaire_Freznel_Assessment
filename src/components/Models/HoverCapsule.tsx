import { useId } from "react";
import type { StoreItem } from "@/models/StoreItem";
import LazyImage from "@/components/Layout/LazyImage";
import { useAltImage } from "@/hooks/useAltImage";
import PriceTag from "./PriceTag";
import WishlistButton from "./WishlistButton";

export default function HoverCapsule({ item, side }: { item: StoreItem; side: "left" | "right" }) {
  const tipId = useId();
  const alt = useAltImage(item.id, item.backdrop("w780") || item.poster("w342"));
  const right = side === "right";
  const show = "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";

  return (
    <div onMouseEnter={alt.load} onFocus={alt.load}
      className="group relative transition-transform duration-200 hover:z-20 hover:scale-[1.05] focus-within:z-20 focus-within:scale-[1.05]">
      <a href={`https://www.themoviedb.org/movie/${item.id}`} target="_blank" rel="noopener noreferrer"
        aria-label={`${item.title}. ${item.priceLabel}`} aria-describedby={tipId}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-steam-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black active:brightness-90">
        <LazyImage src={alt.src} alt="" className="aspect-[616/353] w-full" />
        <span className="mt-0.5 flex justify-end"><PriceTag item={item} tone="sale" /></span>
      </a>

      <div className="absolute right-1.5 top-1.5 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <WishlistButton item={item} />
      </div>

      <div id={tipId} role="tooltip"
        className={`pointer-events-none invisible absolute top-0 z-30 w-[305px] bg-[#2e3c4e] p-4 text-left opacity-0 shadow-2xl
          transition delay-150 max-lg:hidden ${show} ${right ? "left-full ml-3" : "right-full mr-3"}`}>
        <span aria-hidden className={`absolute top-6 size-3 rotate-45 bg-[#2e3c4e] ${right ? "-left-1.5" : "-right-1.5"}`} />
        <p className="text-[15px] font-medium leading-snug text-white">{item.title}</p>
        <p className="text-[11px] text-steam-muted">Released: {item.releasedLong}</p>
        <p className="mt-3 line-clamp-8 text-xs leading-[18px] text-[#acb2b8]">{item.overview || "No description available."}</p>
        <div className="mt-3 bg-[#212d3b] p-2 text-xs">
          <p className="text-[#acb2b8]">English Reviews:</p>
          <p className="text-steam-blue">{item.reviewSummary}</p>
        </div>
        <p className="mt-3 text-xs text-[#acb2b8]">User tags:</p>
        <ul className="mt-1 flex flex-wrap gap-1">
          {item.tags.map((t) => <li key={t} className="bg-[#3f566f] px-1.5 py-0.5 text-[11px] text-[#b8c9db]">{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
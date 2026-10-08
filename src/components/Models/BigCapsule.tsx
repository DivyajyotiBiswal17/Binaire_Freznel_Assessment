import { Link } from "react-router-dom";
import type { StoreItem } from "@/models/StoreItem";
import LazyImage from "@/components/Layout/LazyImage";
import { useAltImage } from "@/hooks/useAltImage";
import { useLists } from "@/hooks/useLists";
import PriceTag from "./PriceTag";
import WishlistButton from "./WishlistButton";

const cartBtn = "px-4 py-2 text-sm font-medium text-white transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function BigCapsule({ item }: { item: StoreItem }) {
  const alt = useAltImage(item.id, item.backdrop("w780") || item.poster("w500"));
  const { inCart, add } = useLists();

  return (
    <div onMouseEnter={alt.load} onFocus={alt.load} className="group relative aspect-[374/448] overflow-hidden bg-black shadow-lg">
      <a href={`https://www.themoviedb.org/movie/${item.id}`} target="_blank" rel="noopener noreferrer"
        aria-label={`${item.title}. ${item.priceLabel}`}
        className="absolute inset-0 outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-steam-blue">
        <LazyImage src={item.poster("w500")} alt="" className="h-full w-full" />
      </a>
      <span className="pointer-events-none absolute bottom-0 right-0 transition-opacity group-hover:opacity-0 group-focus-within:opacity-0">
        <PriceTag item={item} tone="sale" />
      </span>

      <div className="pointer-events-none invisible absolute inset-0 flex flex-col bg-sale-card opacity-0 transition-opacity duration-200
        group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <LazyImage src={alt.src} alt="" className="h-[47%] w-full shrink-0" />
        <div className="relative flex-1 p-5">
          <h3 className="text-2xl font-medium leading-tight text-white">{item.title}</h3>
          <p className="mt-1.5 text-xs">
            <span className="text-steam-blue">{item.reviewLabel}</span>{" "}
            <span className="text-[#c6b3ad]">({item.voteCount.toLocaleString("en-US")})</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => <li key={t} className="bg-black/25 px-2 py-0.5 text-xs text-[#e0cdc6]">{t}</li>)}
          </ul>

          <div className="pointer-events-auto absolute bottom-5 left-5 flex gap-2">
            {inCart(item.id) ? (
              <Link to="/cart" className={`${cartBtn} bg-[#3d4a5a] hover:bg-[#4e5d70]`}>In Cart</Link>
            ) : (
              <button type="button" onClick={() => add("cart", item)} className={`${cartBtn} bg-[#5ba32b] hover:bg-[#6cba33]`}>Add to Cart</button>
            )}
            <WishlistButton item={item} />
          </div>
        </div>
        <span className="absolute bottom-0 right-0"><PriceTag item={item} tone="sale" /></span>
      </div>
    </div>
  );
}
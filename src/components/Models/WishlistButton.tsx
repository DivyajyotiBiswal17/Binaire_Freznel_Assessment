import type { StoreItem } from "@/models/StoreItem";
import { useLists } from "@/hooks/useLists";

export default function WishlistButton({ item, className = "" }: { item: StoreItem; className?: string }) {
  const { onWishlist, toggleWishlist } = useLists();
  const on = onWishlist(item.id);
  return (
    <button type="button" aria-pressed={on} onClick={() => toggleWishlist(item)}
      aria-label={on ? `Remove ${item.title} from wishlist` : `Add ${item.title} to wishlist`}
      title={on ? "On your wishlist" : "Add to wishlist"}
      className={`grid size-9 place-items-center bg-black/60 text-white transition hover:bg-black/85 active:scale-90 aria-pressed:text-[#ff5c7a]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}>
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z"
          fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
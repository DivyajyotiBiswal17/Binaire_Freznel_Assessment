import { useCallback, useEffect, useRef, useState } from "react";
import type { StoreItem } from "@/models/StoreItem";
import StoreCapsule from "./StoreCapsule";

const arrow = "absolute top-1/2 z-10 -translate-y-1/2 bg-black/70 px-2 py-8 text-2xl text-white opacity-0 transition hover:bg-black active:scale-95 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-steam-blue group-hover/row:opacity-100 group-focus-within/row:opacity-100";

export default function CapsuleRow({ items, label }: { items: StoreItem[]; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ prev: false, next: true });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, items]);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="group/row relative">
      <ul
        ref={ref} onScroll={update} tabIndex={0} aria-label={label}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steam-blue"
      >
        {items.map((it) => (
          <li key={it.id} className="w-[231px] shrink-0 snap-start"><StoreCapsule item={it} /></li>
        ))}
      </ul>
      {edge.prev && <button type="button" aria-label={`Scroll ${label} left`} onClick={() => scroll(-1)} className={`${arrow} left-0`}>‹</button>}
      {edge.next && <button type="button" aria-label={`Scroll ${label} right`} onClick={() => scroll(1)} className={`${arrow} right-0`}>›</button>}
    </div>
  );
}
import { useEffect, useState } from "react";
import type { StoreItem } from "@/models/StoreItem";
import LazyImage from "@/components/Layout/LazyImage";
import PriceTag from "./PriceTag";

export default function FeaturedCarousel({ items }: { items: StoreItem[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce || n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  const go = (d: number) => setI((x) => (x + d + n) % n);
  const btn = "absolute top-1/2 z-10 -translate-y-1/2 bg-black/50 px-2 py-6 text-2xl text-white transition hover:bg-black/80 active:scale-95 focus-visible:outline-2 focus-visible:outline-steam-blue";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured and recommended"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-[330px] overflow-hidden bg-steam-panel shadow-lg focus-within:ring-2 focus-within:ring-steam-blue/60"
    >
      {items.map((it, idx) => (
        <article
          key={it.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${idx + 1} of ${n}`}
          inert={idx !== i}
          className={`absolute inset-0 flex transition-opacity duration-700 ${idx === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <LazyImage src={it.backdrop("w780")} alt="" className="h-full flex-1" />
          <div className="flex w-[280px] flex-col justify-between bg-gradient-to-b from-[#1b2838] to-[#16202d] p-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{it.title}</h2>
              <p className="mt-2 line-clamp-5 text-sm text-steam-text">{it.overview}</p>
              <p className="mt-2 text-xs text-steam-muted">{it.tags.join(" · ")}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-steam-blue">★ {it.rating.toFixed(1)}</span>
              <PriceTag item={it} />
            </div>
          </div>
        </article>
      ))}

      <button type="button" aria-label="Previous slide" onClick={() => go(-1)} className={`${btn} left-0`}>‹</button>
      <button type="button" aria-label="Next slide" onClick={() => go(1)} className={`${btn} right-[280px]`}>›</button>

      <div className="absolute bottom-2 left-3 z-10 flex gap-1.5">
        {items.map((it, idx) => (
          <button key={it.id} type="button" aria-label={`Go to slide ${idx + 1}`} aria-current={idx === i}
            onClick={() => setI(idx)}
            className={`h-2 w-5 rounded-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-steam-blue ${idx === i ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
    </section>
  );
}
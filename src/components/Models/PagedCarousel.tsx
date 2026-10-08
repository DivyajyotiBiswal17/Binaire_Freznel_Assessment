import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";

interface Props<T> {
  items: T[]; label: string; perPage?: number; autoplayMs?: number; gap?: string;
  getKey: (item: T) => string | number;
  renderItem: (item: T, indexInPage: number) => ReactNode;
}

const arrow = "absolute top-1/2 z-10 -translate-y-1/2 bg-black/40 px-1 py-3 text-white/80 transition hover:text-white active:scale-90 focus-visible:outline-2 focus-visible:outline-steam-blue xl:bg-transparent";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PagedCarousel<T>({ items, label, perPage = 3, autoplayMs, gap = "gap-4", getKey, renderItem }: Props<T>) {
  const pages = useMemo(() => {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += perPage) out.push(items.slice(i, i + perPage));
    return out;
  }, [items, perPage]);
  const n = pages.length;
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLDivElement>(null);

  const go = (p: number) => setPage(((p % n) + n) % n);

  useEffect(() => {
    gsap.to(track.current, { xPercent: -100 * page, duration: reduced() ? 0 : 0.6, ease: "power2.inOut" });
  }, [page]);

  useEffect(() => {
    if (!autoplayMs || paused || reduced() || n < 2) return;
    const t = setInterval(() => setPage((p) => (p + 1) % n), autoplayMs);
    return () => clearInterval(t);
  }, [autoplayMs, paused, n]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="overflow-x-clip">
        <div ref={track} className="flex">
          {pages.map((group, p) => (
            <div key={p} inert={p !== page} role="group" aria-roledescription="slide" aria-label={`${p + 1} of ${n}`}
              className={`grid w-full shrink-0 basis-full ${gap}`}
              style={{ gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` }}>
              {group.map((it, i) => <div key={getKey(it)} className="min-w-0">{renderItem(it, i)}</div>)}
            </div>
          ))}
        </div>
      </div>

      {n > 1 && (
        <>
          <button type="button" aria-label={`${label}: previous`} onClick={() => go(page - 1)} className={`${arrow} left-1 xl:-left-12`}>
            <svg viewBox="0 0 20 40" className="h-10 w-5" aria-hidden><path d="M16 4L4 20l12 16" fill="none" stroke="currentColor" strokeWidth="4" /></svg>
          </button>
          <button type="button" aria-label={`${label}: next`} onClick={() => go(page + 1)} className={`${arrow} right-1 xl:-right-12`}>
            <svg viewBox="0 0 20 40" className="h-10 w-5" aria-hidden><path d="M4 4l12 16L4 36" fill="none" stroke="currentColor" strokeWidth="4" /></svg>
          </button>
          <div className="mt-2 flex justify-center">
            {pages.map((_, i) => (
              <button key={i} type="button" aria-label={`${label}: page ${i + 1} of ${n}`}
                aria-current={i === page ? "true" : undefined} onClick={() => go(i)}
                className="group/dot px-[2.5px] py-2 focus-visible:outline-2 focus-visible:outline-steam-blue">
                <span className={`block h-[7px] w-3.5 rounded-full transition-colors ${i === page ? "bg-white" : "bg-white/25 group-hover/dot:bg-white/55"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
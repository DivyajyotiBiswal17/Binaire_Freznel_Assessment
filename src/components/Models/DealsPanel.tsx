import { Link } from "react-router-dom";
import type { StoreItem } from "@/models/StoreItem";
import PagedCarousel from "./PagedCarousel";
import HoverCapsule from "./HoverCapsule";

interface Props { carousel: StoreItem[]; grid: StoreItem[]; loading: boolean; }

export default function DealsPanel({ carousel, grid, loading }: Props) {
  if (!loading && !carousel.length && !grid.length) return null;
  return (
    <section aria-labelledby="deals-h" className="mx-auto mt-[9px] max-w-(--page-w) px-3">
      <div className="bg-sale-panel px-4 pb-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="deals-h" className="text-xl font-bold text-white">Featured Deep Discounts</h2>
            <p className="mt-1 text-lg text-[#d3c6c1]">Especially great deals on some of the all-time greats</p>
          </div>
          <Link to="/search?sort=vote_average.desc"
            className="shrink-0 bg-[#c4c4c4] px-5 py-1.5 text-sm font-medium text-[#1e1e1e] transition
              hover:bg-white active:bg-[#a8a8a8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            See All
          </Link>
        </div>
        <div className="mt-7">
          {loading ? (
            <div className="grid grid-cols-3 gap-3" aria-hidden>
              {[0, 1, 2].map((i) => <div key={i} className="skeleton aspect-[616/353]" />)}
            </div>
          ) : (
            <PagedCarousel items={carousel} label="Featured deep discounts" gap="gap-3" getKey={(i) => i.id}
              renderItem={(it, idx) => <HoverCapsule item={it} side={idx < 2 ? "right" : "left"} />} />
          )}
        </div>
      </div>

      <ul className="mt-[30px] grid grid-cols-2 gap-3 lg:grid-cols-4">
        {grid.map((it, i) => (
          <li key={it.id}><HoverCapsule item={it} side={i % 4 < 2 ? "right" : "left"} /></li>
        ))}
      </ul>
    </section>
  );
}
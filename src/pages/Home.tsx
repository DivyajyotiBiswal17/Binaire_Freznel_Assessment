import { useMemo } from "react";
import { Link } from "react-router-dom";
import { movieService } from "@/api/MovieService";
import { useAsync } from "@/hooks/useAsync";
import { CATEGORIES } from "@/models/genres";
import type { StoreItem } from "@/models/StoreItem";
import SaleHero from "@/components/Models/SaleHero";
import PagedCarousel from "@/components/Models/PagedCarousel";
import BigCapsule from "@/components/Models/BigCapsule";
import GiftCardButton from "@/components/Models/GiftCardButton";
import DealsPanel from "@/components/Models/DealsPanel";
import DiscoveryBanner from "@/components/Models/DiscoveryBanner";
import HomeTabs from "@/components/Models/HomeTabs";
import RowSection from "@/components/Models/RowSection";
import FallingLeaves from "@/components/Models/FallingLeaves";

const withArt = (items?: StoreItem[]) => (items ?? []).filter((i) => i.hasBackdrop && i.hasPoster);
const trim = <T,>(arr: T[], multiple: number) => arr.slice(0, arr.length - (arr.length % multiple));
const wrap = "mx-auto mt-10 max-w-(--page-w) px-3";

export default function Home() {
  const popular = useAsync(() => movieService.popular(), []);
  const top1 = useAsync(() => movieService.topRated(1), []);
  const top2 = useAsync(() => movieService.topRated(2), []);
  const randomPage = useMemo(() => 1 + Math.floor(Math.random() * 50), []);

  const big = withArt(popular.data?.items).slice(0, 15);
  const deals = trim(withArt(top1.data?.items).filter((i) => i.discount > 0), 3).slice(0, 12);
  const grid = trim(withArt(top2.data?.items).filter((i) => i.discount > 0), 4).slice(0, 16);

  return (
    <div className="relative">
      <FallingLeaves />
      <SaleHero />

      <section aria-labelledby="featured-h" className="mx-auto max-w-(--page-w) px-3">
        <div className="relative z-10 mx-auto mt-6 flex max-w-(--page-w) justify-end px-3"><GiftCardButton /></div>
        <h2 id="featured-h" className="sr-only">Featured and recommended</h2>
        <div className="mx-auto max-w-[1154px]">
          {popular.loading ? (
            <div className="grid grid-cols-3 gap-4" aria-hidden>
              {[0, 1, 2].map((i) => <div key={i} className="skeleton aspect-[374/448]" />)}
            </div>
          ) : big.length ? (
            <PagedCarousel items={big} label="Featured and recommended" autoplayMs={7000} getKey={(i) => i.id}
              renderItem={(it) => <BigCapsule item={it} />} />
          ) : (
            <p className="bg-black/30 p-4 text-sm">Featured titles are unavailable right now. Connect once to save them for offline use.</p>
          )}
        </div>
      </section>

      <div className="mx-auto mt-9 flex max-w-(--page-w) justify-end px-3"><GiftCardButton /></div>

      <DealsPanel carousel={deals} grid={grid} loading={top1.loading || top2.loading} />
      <DiscoveryBanner images={big.map((i) => i.backdrop("w780"))} />
      <HomeTabs />

      <section aria-labelledby="cat-h" className={wrap}>
        <h2 id="cat-h" className="mb-2 text-sm font-medium uppercase tracking-wide text-white">Browse by Category</h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/category/${c.slug}`}
                className="block bg-gradient-to-r from-[#3d5a73] to-[#1f3346] px-4 py-5 text-center font-medium text-white transition
                  hover:brightness-125 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steam-blue">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className={wrap}><RowSection title="Recently Updated" seeAllTo="/search?sort=primary_release_date.desc" load={() => movieService.nowPlaying(2)} /></div>
      <div className={wrap}><RowSection title="The Community Recommends" seeAllTo="/search?sort=vote_average.desc" load={() => movieService.topRated(3)} /></div>
      <div className={wrap}><RowSection title="Under ₹500" seeAllTo="/search?filter=topsellers" load={() => movieService.underPrice(500)} /></div>

      <section aria-labelledby="empty-h" className={wrap}>
        <div className="bg-black/30 p-6 text-center">
          <h2 id="empty-h" className="text-lg text-white">We're out of personalized recommendations for you right now</h2>
          <p className="mt-1 text-sm text-steam-muted">We can recommend some different titles once you've watched more.</p>
          <p className="mt-3 text-sm">
            Still looking for more? Check out a{" "}
            <Link to={`/search?page=${randomPage}`} className="text-steam-blue transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">random title</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
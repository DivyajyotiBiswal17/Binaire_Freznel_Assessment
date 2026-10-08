import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { movieService } from "@/api/MovieService";
import { useAsync } from "@/hooks/useAsync";
import { useLazyMount } from "@/hooks/useLazyMount";
import type { StoreItem } from "@/models/StoreItem";
import StoreRow from "./StoreRow";

interface Tab { key: string; label: string; load: () => Promise<StoreItem[]>; more: { label: string; to: string }[]; freeOnly?: boolean; }

const TABS: Tab[] = [
  { key: "newreleases", label: "Popular New Releases", load: () => movieService.nowPlaying().then((p) => p.items),
    more: [{ label: "Popular New Releases", to: "/search?filter=popularnew" }, { label: "All New Releases", to: "/search?sort=primary_release_date.desc" }] },
  { key: "topsellers", label: "Top Sellers", load: () => movieService.popular().then((p) => p.items),
    more: [{ label: "Top Sellers", to: "/search?filter=topsellers" }, { label: "Global Top Sellers", to: "/search?sort=revenue.desc" }] },
  { key: "upcoming", label: "Popular Upcoming", load: () => movieService.upcoming().then((p) => p.items),
    more: [{ label: "Upcoming Releases", to: "/search?filter=comingsoon" }] },
  { key: "trendingfree", label: "Trending Free", load: () => movieService.trendingFree(), freeOnly: true,
    more: [{ label: "Free to Play", to: "/search?filter=trending" }] },
];

const trigger = (k: string) => `tab_${k}_content_trigger`;
const linkCls = "text-steam-blue transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue";

function Panel({ tab, includeFree }: { tab: Tab; includeFree: boolean }) {
  const { data, loading, error } = useAsync(tab.load, []);
  const items = (data ?? []).filter((i) => tab.freeOnly || includeFree || !i.isFree).slice(0, 10);
  return (
    <div id={`tab_${tab.key}_content`} role="region" aria-label={tab.label} className="tab-panel">
      {loading && <div className="space-y-1" aria-busy="true">{Array.from({ length: 8 }, (_, k) => <div key={k} className="skeleton h-[77px]" />)}</div>}
      {error && !data && <p className="bg-black/20 p-4 text-sm">Couldn't load this list. Connect once to save it for offline use.</p>}
      {data && (items.length
        ? <ul className="space-y-1">{items.map((it) => <li key={it.id}><StoreRow item={it} /></li>)}</ul>
        : <p className="bg-black/20 p-4 text-sm">Nothing to show with these options.</p>)}
      <p className="mt-3 text-xs text-steam-muted">
        See more:{" "}
        {tab.more.map((m, i) => (
          <span key={m.to + m.label}>{i > 0 && " or "}<Link to={m.to} className={linkCls}>{m.label}</Link></span>
        ))}
      </p>
    </div>
  );
}

export default function HomeTabs() {
  const { hash } = useLocation();
  const { ref, visible } = useLazyMount<HTMLElement>();
  const [includeFree, setIncludeFree] = useState(true);
  const active = TABS.find((t) => hash === `#${trigger(t.key)}`) ?? TABS[0];

  return (
    <section ref={ref} aria-label="Browse lists" className="mx-auto mt-10 max-w-(--page-w) px-3">
      <nav aria-label="Lists" className="flex flex-wrap border-b border-white/10">
        {TABS.map((t) => (
          <a key={t.key} href={`#${trigger(t.key)}`} aria-current={active.key === t.key ? "true" : undefined}
            className={`px-4 py-2 text-sm transition hover:bg-white/10 hover:text-white active:bg-white/20 focus-visible:outline-2 focus-visible:outline-steam-blue
              ${active.key === t.key ? "bg-white/10 text-white" : ""}`}>
            {t.label}
          </a>
        ))}
      </nav>

      <div className="mt-2 flex justify-end">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs transition hover:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-steam-blue">
          <input type="checkbox" className="size-4 accent-steam-blue" checked={includeFree} onChange={(e) => setIncludeFree(e.target.checked)} />
          Include free to play items
        </label>
      </div>

      <div className="tab-panels mt-2 min-h-[420px]">
        {TABS.map((t) => <span key={t.key} id={trigger(t.key)} className="tab-anchor" />)}
        {visible
          ? TABS.map((t) => <Panel key={t.key} tab={t} includeFree={includeFree} />)
          : <div className="skeleton h-[420px]" aria-hidden />}
      </div>
    </section>
  );
}
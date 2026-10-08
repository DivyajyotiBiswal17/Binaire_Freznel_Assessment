import { useState, type CSSProperties, type ReactNode } from "react";
import { GENRES } from "@/models/genres";
import type { SearchQuery } from "@/search/SearchQuery";
import { ResultFilter, type FilterState } from "@/search/ResultFilter";

const TOP_TAGS = [28, 12, 35, 18, 16];
const RATINGS = [{ v: 0, l: "Any rating" }, { v: 5, l: "5+" }, { v: 6, l: "6+" }, { v: 7, l: "7+" }, { v: 8, l: "8+" }];

interface Props {
  query: SearchQuery; filters: FilterState; serverDisabled: boolean;
  onQuery: (q: SearchQuery) => void; onFilters: (f: FilterState) => void;
}

function Box({ title, open = true, children }: { title: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="bg-[#16202d]">
      <summary className="cursor-pointer list-none bg-[#3a526b]/80 px-3 py-[5px] text-[13px] text-[#dfe3e6] transition-colors
        hover:bg-[#46627f] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steam-blue [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="p-[14px]">{children}</div>
    </details>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-[5px] text-sm text-[#c6d4df] transition-colors hover:text-white">
      <input type="checkbox" className="steam-check" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  );
}

export default function SearchSidebar({ query, filters, serverDisabled, onQuery, onFilters }: Props) {
  const [find, setFind] = useState("");
  const { genres, excluded, minRating } = query.state;

  const steps = ResultFilter.priceSteps;
  const idx = Math.max(0, steps.indexOf(filters.maxPrice));
  const priceText = ResultFilter.priceLabel(filters.maxPrice);

  const include = (id: number) => onQuery(query.patch({
    genres: genres.includes(id) ? genres.filter((g) => g !== id) : [...genres, id],
    excluded: excluded.filter((g) => g !== id),
  }));
  const exclude = (id: number) => onQuery(query.patch({
    excluded: excluded.includes(id) ? excluded.filter((g) => g !== id) : [...excluded, id],
    genres: genres.filter((g) => g !== id),
  }));

  const pool = Object.entries(GENRES).map(([id, name]) => ({ id: Number(id), name }));
  const needle = find.trim().toLowerCase();
  const shown = needle
    ? pool.filter((g) => g.name.toLowerCase().includes(needle))
    : pool
        .filter((g) => TOP_TAGS.includes(g.id) || genres.includes(g.id) || excluded.includes(g.id))
        .sort((a, b) => (TOP_TAGS.indexOf(a.id) + 99) % 99 - (TOP_TAGS.indexOf(b.id) + 99) % 99);

  return (
    <div className="space-y-[17px]">
      <Box title="Narrow by Price">
        <input type="range" min={0} max={steps.length - 1} step={1} value={idx} className="price-range"
          aria-label="Maximum price" aria-valuetext={priceText}
          style={{ "--p": `${(idx / (steps.length - 1)) * 100}%` } as CSSProperties}
          onChange={(e) => onFilters({ ...filters, maxPrice: steps[Number(e.target.value)] })} />
        <p className="mt-3 text-center text-sm text-[#c6d4df]" aria-hidden>{priceText}</p>
        <hr className="my-3 border-white/10" />
        <Check checked={filters.discountsOnly} onChange={(v) => onFilters({ ...filters, discountsOnly: v })}>Discounts &amp; Events</Check>
        <Check checked={filters.hideFree} onChange={(v) => onFilters({ ...filters, hideFree: v })}>Hide free to play items</Check>
      </Box>

      <fieldset disabled={serverDisabled} className="m-0 min-w-0 space-y-[17px] border-0 p-0 disabled:opacity-50">
        <legend className="sr-only">Tag and rating filters</legend>

        <Box title="Narrow by tag">
          <ul>
            {shown.map((g) => {
              const ex = excluded.includes(g.id);
              return (
                <li key={g.id} className="flex items-center gap-2 py-[5px]">
                  <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-sm text-[#c6d4df] transition-colors hover:text-white">
                    <input type="checkbox" className="steam-check" checked={genres.includes(g.id)} onChange={() => include(g.id)} />
                    <span className={ex ? "text-[#8f98a0] line-through" : ""}>{g.name}</span>
                  </label>
                  <button type="button" aria-pressed={ex} aria-label={`Exclude ${g.name}`} title={`Exclude ${g.name}`} onClick={() => exclude(g.id)}
                    className="grid size-4 place-items-center rounded-[2px] bg-[#3d4450] text-[#9aa4ad] transition hover:bg-[#4e5d70] hover:text-white
                      active:scale-90 aria-pressed:bg-[#8c2f2f] aria-pressed:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67c1f5]">
                    <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden><path d="M1 5h8" stroke="currentColor" strokeWidth="2" /></svg>
                  </button>
                </li>
              );
            })}
            {needle && shown.length === 0 && <li className="py-2 text-sm text-steam-muted">No matching tags.</li>}
          </ul>
          <label htmlFor="tag-find" className="sr-only">Search for more tags</label>
          <input id="tag-find" type="search" value={find} onChange={(e) => setFind(e.target.value)} placeholder="search for more tags"
            className="mt-2 w-full max-w-[213px] rounded-[2px] bg-[#101a25] px-2 py-1 text-sm text-white outline-none ring-1 ring-black/40
              transition placeholder:italic placeholder:text-[#627485] hover:bg-[#142130] focus:ring-[#67c1f5]" />
        </Box>

        <Box title="Narrow by User Rating" open={false}>
          <div role="radiogroup" aria-label="Minimum user rating">
            {RATINGS.map((r) => (
              <label key={r.v} className="flex cursor-pointer items-center gap-2.5 py-[5px] text-sm text-[#c6d4df] transition-colors hover:text-white">
                <input type="radio" name="rating" className="size-4 accent-[#1a9fff]" checked={minRating === r.v}
                  onChange={() => onQuery(query.patch({ minRating: r.v }))} />
                {r.l}
              </label>
            ))}
          </div>
        </Box>
      </fieldset>
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { movieService } from "@/api/MovieService";
import { useAsync } from "@/hooks/useAsync";
import { SearchQuery } from "@/search/SearchQuery";
import { ResultFilter, type FilterState } from "@/search/ResultFilter";
import { SortOptions } from "@/sorting/SortOptions";
import { Pagination } from "@/utils/Pagination";
import SearchSidebar from "@/components/Filters/SearchSidebar";
import SearchBar from "@/components/Search/SearchBar";
import SearchInfoBar from "@/components/Search/SearchInfoBar";
import PaginationNav from "@/components/Search/PaginationNav";
import SearchResultRow from "@/components/Models/SearchResultRow";

const TITLES: Record<string, string> = {
  topsellers: "Top Sellers", popularnew: "Popular New Releases",
  comingsoon: "Upcoming Releases", trending: "Trending Now",
};

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const key = params.toString();
  const query = useMemo(() => SearchQuery.fromParams(params), [key]);
  const { data, loading, error } = useAsync(() => movieService.discover(query.toDiscover()), [key]);
  const [filters, setFilters] = useState<FilterState>(ResultFilter.defaults);

  const visible = useMemo(() => (data ? ResultFilter.apply(data.items, filters) : []), [data, filters]);
  const hidden = data ? data.items.length - visible.length : 0;

  const update = (q: SearchQuery) => setParams(q.toParams());
  const { term, filter, sort, page } = query.state;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevPage = useRef(page);
  useEffect(() => {
    if (prevPage.current === page) return;
    prevPage.current = page;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [page]);

  const title = term ? `Results for “${term}”` : TITLES[filter] ?? "Browse Titles";

  return (
    <>
      <div className="search-band">
        <div className="mx-auto max-w-(--page-w) px-3 pt-[26px]">
          <h1 id="results-h" ref={headingRef} tabIndex={-1} className="text-[34px] font-bold leading-[38px] text-white outline-none">{title}</h1>
          <p className="mt-[18px] text-lg text-[#8f9aa5]">{term ? "Search results" : "All Products"}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-(--page-w) items-start gap-[14px] px-3 lg:grid-cols-[minmax(0,1fr)_311px]">
        <section aria-labelledby="results-h" aria-busy={loading} className="min-w-0">
          <div className="bg-[#0e1722]">
            <SearchBar term={term} sort={sort || SortOptions.default} sortDisabled={query.isTextSearch}
              onSearch={(t) => update(query.patch({ term: t }))}
              onSort={(v) => update(query.patch({ sort: v === SortOptions.default ? "" : v }))} />
            <SearchInfoBar total={data?.totalResults ?? 0} hidden={hidden} term={term}
              hideNoArt={filters.hideNoArt} onHideNoArt={(v) => setFilters({ ...filters, hideNoArt: v })} />
          </div>

          <p role="status" className="sr-only">{data ? `${visible.length} results shown on this page.` : loading ? "Loading results." : ""}</p>

          <div className="mt-[5px]">
            {error && !data && <p className="bg-[#0e1722] p-4 text-sm">Couldn't load results. Connect once to save this view for offline use.</p>}

            {loading && !data && (
              <div className="space-y-1.5" aria-hidden>
                {Array.from({ length: 10 }, (_, i) => <div key={i} className="skeleton h-[70px]" />)}
              </div>
            )}

            {data && (
              <>
                {visible.length === 0 ? (
                  <p className="bg-[#0e1722] p-4 text-sm">No titles on this page match your filters. Try loosening them or going to the next page.</p>
                ) : (
                  <ul className={`space-y-1.5 transition-opacity duration-200 ${loading ? "opacity-50" : ""}`}>
                    {visible.map((it) => <li key={it.id}><SearchResultRow item={it} /></li>)}
                  </ul>
                )}
                <PaginationNav model={new Pagination(data.page, data.totalPages)} onChange={(p) => update(query.patch({ page: p }))} />
              </>
            )}
          </div>
        </section>

        <aside aria-label="Search options">
          <SearchSidebar query={query} filters={filters} serverDisabled={query.isTextSearch} onQuery={update} onFilters={setFilters} />
        </aside>
      </div>
    </>
  );
}
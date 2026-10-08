import { useEffect, useState } from "react";
import { SortOptions } from "@/sorting/SortOptions";

interface Props { term: string; sort: string; sortDisabled: boolean; onSearch: (term: string) => void; onSort: (v: string) => void; }

export default function SearchBar({ term, sort, sortDisabled, onSearch, onSort }: Props) {
  const [value, setValue] = useState(term);
  useEffect(() => setValue(term), [term]);

  return (
    <div className="flex flex-wrap items-center gap-x-[9px] gap-y-2 px-[5px] py-[9px]">
      <form role="search" onSubmit={(e) => { e.preventDefault(); onSearch(value.trim()); }} className="flex min-w-0 flex-1 items-center gap-[9px]">
        <label htmlFor="search-term" className="sr-only">Search term or tag</label>
        <input id="search-term" type="search" value={value} onChange={(e) => setValue(e.target.value)}
          placeholder="enter search term or tag"
          className="h-[26px] w-full max-w-[311px] rounded-[2px] bg-[rgba(103,193,245,.12)] px-1.5 text-sm text-white outline-none ring-1 ring-black/30
            transition placeholder:text-[#b8c7d4] hover:bg-[rgba(103,193,245,.18)] focus:bg-[rgba(103,193,245,.24)] focus:ring-[#67c1f5]" />
        <button type="submit"
          className="h-[26px] shrink-0 rounded-[2px] bg-[rgba(103,193,245,.2)] px-4 text-[13px] text-[#67c1f5] transition
            hover:bg-[#66c0f4] hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67c1f5]">
          Search
        </button>
      </form>

      <div className="ml-auto flex items-center gap-2 pr-1 text-[13px] text-[#626d78]">
        <label htmlFor="sort-by">Sort by</label>
        <select id="sort-by" className="steam-select" value={sort} disabled={sortDisabled} onChange={(e) => onSort(e.target.value)}>
          {SortOptions.all.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
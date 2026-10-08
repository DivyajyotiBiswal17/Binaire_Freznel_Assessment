import { useRef, useState, type FocusEvent, type KeyboardEvent } from "react";

interface Props { total: number; hidden: number; term: string; hideNoArt: boolean; onHideNoArt: (v: boolean) => void; }

export default function SearchInfoBar({ total, hidden, term, hideNoArt, onHideNoArt }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape" && open) { setOpen(false); btn.current?.focus(); } };
  const onBlur = (e: FocusEvent) => { if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false); };

  return (
    <div className="flex border-t border-white/5">
      <p className="flex-1 px-[9px] py-[9px] text-xs leading-[15px] text-[#dfe6ec]">
        {total.toLocaleString("en-US")} results match your search.
        {hidden > 0 && ` ${hidden} title${hidden === 1 ? " has" : "s have"} been excluded based on your preferences.`}
        {term && " Sort and tag options aren't available when searching by text."}
      </p>

      <div ref={root} onKeyDown={onKeyDown} onBlur={onBlur}
        className="relative flex w-[61px] shrink-0 items-center justify-center border-l border-[#1b2838]">
        <button ref={btn} type="button" aria-expanded={open} aria-haspopup="true" aria-label="Search preferences" onClick={() => setOpen((o) => !o)}
          className="grid size-9 place-items-center text-[#8f98a0] transition hover:text-white active:scale-90 aria-expanded:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
          </svg>
        </button>
        <div hidden={!open} className="absolute right-0 top-full z-20 mt-px w-64 bg-[#2a3a4c] p-3 shadow-xl">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white">Search preferences</p>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#c6d4df] transition-colors hover:text-white">
            <input type="checkbox" className="steam-check" checked={hideNoArt} onChange={(e) => onHideNoArt(e.target.checked)} />
            Hide titles without artwork
          </label>
        </div>
      </div>
    </div>
  );
}
import { useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { LANGUAGES, LanguageStore } from "@/utils/LanguageStore";

export default function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const current = LanguageStore.get();

  const choose = (code: string) => {
    setOpen(false);
    if (code === current) return;
    LanguageStore.set(code);
    window.location.reload();
  };
  const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape" && open) { setOpen(false); btn.current?.focus(); } };
  const onBlur = (e: FocusEvent) => { if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false); };

  return (
    <div ref={root} className="relative" onKeyDown={onKeyDown} onBlur={onBlur}>
      <button ref={btn} type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-[13px] text-[#b8b6b4] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">
        language <span aria-hidden className="text-[9px]">▼</span>
      </button>
      <ul hidden={!open} className="absolute right-0 top-full z-50 mt-1 min-w-44 bg-[#3d4450] py-1 shadow-xl">
        {LANGUAGES.map((l) => (
          <li key={l.code}>
            <button type="button" lang={l.code} aria-current={l.code === current ? "true" : undefined} onClick={() => choose(l.code)}
              className="block w-full px-4 py-2 text-left text-sm text-[#dcdedf] transition-colors hover:bg-[#dcdedf] hover:text-[#171a21]
                active:bg-white focus-visible:bg-[#dcdedf] focus-visible:text-[#171a21] focus-visible:outline-none aria-[current=true]:font-semibold">
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
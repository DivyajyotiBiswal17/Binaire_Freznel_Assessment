import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Menu } from "@/models/navigation";

export default function NavMenu({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  const { pathname, search } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname, search]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) { setOpen(false); btn.current?.focus(); }
  };
  const onBlur = (e: FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
  };

  return (
    <div ref={root} className="relative h-full shrink-0"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onKeyDown={onKeyDown} onBlur={onBlur}>
      <button ref={btn} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}
        className="inline-flex h-full items-center whitespace-nowrap px-3.5 text-sm font-medium text-white transition-colors
          hover:bg-[#dcdedf] hover:text-[#171a21] aria-expanded:bg-[#dcdedf] aria-expanded:text-[#171a21]
          active:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steam-blue">
        {menu.label}
        <svg viewBox="0 0 10 6" className="ml-1.5 size-2.5" aria-hidden>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <ul id={id} hidden={!open}
        className="absolute left-0 top-full z-50 min-w-56 bg-[#3d4450] py-1 shadow-xl animate-[fade-up_.15s_ease-out]">
        {menu.items.map((i) => (
          <li key={i.to}>
            <Link to={i.to}
              className="block px-4 py-2 text-sm text-[#dcdedf] transition-colors hover:bg-[#dcdedf] hover:text-[#171a21]
                active:bg-white focus-visible:bg-[#dcdedf] focus-visible:text-[#171a21] focus-visible:outline-none">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
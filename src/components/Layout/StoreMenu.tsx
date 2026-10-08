import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const ITEMS = [
  { label: "Home", to: "/" },
  { label: "Discovery Queue", to: "/search?filter=trending" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Charts", to: "/search?sort=vote_average.desc" },
];

interface Props { linkClass: (s: { isActive: boolean }) => string; }

export default function StoreMenu({ linkClass }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const id = useId();
  const { pathname, search } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname, search]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) { setOpen(false); link.current?.focus(); }
  };
  const onFocus = (e: FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node)) setOpen(true);
  };
  const onBlur = (e: FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
  };

  return (
    <div ref={root} className="relative"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>
      <NavLink ref={link} to="/" end className={linkClass}
        aria-haspopup="true" aria-expanded={open} aria-controls={id}>
        Store
      </NavLink>

      <div id={id} hidden={!open} className="absolute left-0 top-full z-50 pt-1.5">
        <ul className="min-w-[125px] bg-[#3d4450] py-1 shadow-xl animate-[fade-up_.15s_ease-out]">
          {ITEMS.map((i) => (
            <li key={i.label}>
              <Link to={i.to}
                className="block px-3.5 py-[7px] text-[13px] text-[#dcdedf] transition-colors hover:bg-[#dcdedf] hover:text-[#171a21]
                  active:bg-white focus-visible:bg-[#dcdedf] focus-visible:text-[#171a21] focus-visible:outline-none">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/auth/AuthService";
import { useLists } from "@/hooks/useLists";
import { STORE_MENUS } from "@/models/navigation";
import NavMenu from "./NavMenu";
import StoreMenu from "./StoreMenu";
import LanguageMenu from "./LanguageMenu";

const main = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-0.5 text-base font-semibold uppercase tracking-wide transition-colors hover:text-[#1a9fff] active:text-white
   focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steam-blue
   ${isActive ? "border-[#1a9fff] text-[#1a9fff]" : "border-transparent text-white"}`;
const small = "text-[13px] text-[#b8b6b4] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue";

export default function Header() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const { cart } = useLists();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/search?term=${encodeURIComponent(term.trim())}`);
  };

  return (
    <>
      <header className="bg-steam-header">
        <div className="relative mx-auto flex h-[105px] max-w-(--page-w) items-center px-3">
          <Link to="/" aria-label="Freznel home" className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-steam-blue">
            <svg viewBox="0 0 48 48" className="size-11" aria-hidden>
              <circle cx="24" cy="24" r="22" fill="#d9dde1" />
              <circle cx="24" cy="24" r="9" fill="#171a21" />
              <circle cx="35" cy="13" r="5" fill="#171a21" />
            </svg>
            <span className="text-[26px] font-bold tracking-[0.12em] text-white">FREZNEL</span>
          </Link>

          <nav aria-label="Main" className="ml-14 flex gap-4">
            <StoreMenu linkClass={main} />
            <NavLink to="/search?filter=topsellers" className={main}>Top Sellers</NavLink>
            <NavLink to="/category/exploration_open_world" className={main}>Open World</NavLink>
            <a href="#about" className={main({ isActive: false })}>About</a>
          </nav>

          <nav aria-label="Account" className="absolute right-3 top-3 flex items-center gap-2">
            <a href="#about"
              className="mr-2 inline-flex items-center gap-1.5 rounded-[2px] bg-gradient-to-b from-[#75b022] to-[#588a1b] px-3 py-1 text-[13px] text-white transition
                hover:brightness-110 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden><path d="M8 2v8M4.5 7L8 10.5 11.5 7M3 13h10" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
              Install Freznel
            </a>
            {ready && user ? (
              <>
                <span className="text-[13px] text-steam-blue">{user.displayName ?? user.email}</span>
                <span aria-hidden className="text-[#b8b6b4]">|</span>
                <button type="button" onClick={() => authService.signOut()} className={small}>sign out</button>
              </>
            ) : (
              <Link to="/login" className={small}>sign in</Link>
            )}
            <span aria-hidden className="text-[#b8b6b4]">|</span>
            <LanguageMenu />
          </nav>
        </div>
      </header>

      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#1a2840] to-[#1b3350] shadow-[0_0_14px_rgba(255,255,255,0.28)]">
        <div className="mx-auto flex min-h-[45px] max-w-(--page-w) flex-wrap items-center justify-between gap-x-3 px-3">
          <nav aria-label="Store" className="flex h-[45px] shrink-0">
            {STORE_MENUS.map((m) => <NavMenu key={m.label} menu={m} />)}
          </nav>

          <div className="my-[5px] flex min-w-[220px] flex-1 items-center justify-end gap-6">
            <form role="search" onSubmit={submit} className="flex h-[34px] min-w-0 max-w-[479px] flex-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <label htmlFor="store-search" className="sr-only">Search the store</label>
              <input id="store-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)}
                placeholder="Search the store"
                className="h-full min-w-0 flex-1 bg-[linear-gradient(to_right,#161d28,#2a3a4c)] px-3 text-sm text-white outline-none
                  placeholder:italic placeholder:text-[#8f98a0] hover:bg-[linear-gradient(to_right,#1a2331,#304256)]
                  focus:bg-none focus:bg-[#dcdedf] focus:text-[#171a21] focus:placeholder:text-[#5b6670]" />
              <button type="submit" aria-label="Search"
                className="grid w-[34px] place-items-center bg-[#1a9fff] text-white transition-colors hover:bg-[#47b3ff] active:bg-[#1385db]
                  focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                  <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M12.5 12.5L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </form>

            {cart.length > 0 && (
              <Link to="/cart" aria-label={`Cart, ${cart.length} item${cart.length === 1 ? "" : "s"}`}
                className="inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-[2px] bg-[#1a9fff] px-3 text-[13px] font-medium text-white transition
                  hover:bg-[#47b3ff] active:bg-[#1385db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                  <path d="M1 2h3l2.2 9.5h9L17 5H5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx="8" cy="16" r="1.6" fill="currentColor" /><circle cx="14" cy="16" r="1.6" fill="currentColor" />
                </svg>
                Cart <span className="text-xs">{cart.length}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
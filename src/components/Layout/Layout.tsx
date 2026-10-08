import type { CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ConnectionBanner from "./ConnectionBanner";
import PageTransition from "./PageTransition";
import AddedToCartDialog from "@/components/Models/AddedToCartDialog";
import { useLists } from "@/hooks/useLists";

export default function Layout() {
  const { pathname } = useLocation();
  const home = pathname === "/";
  const search = pathname.startsWith("/search");
  const { message } = useLists();

  const mainClass = home
    ? "sale-theme relative isolate overflow-x-clip pb-12"
    : search
      ? "search-theme pb-12"
      : "mx-auto w-full max-w-(--page-w) px-3 pb-12 pt-4";

  return (
    <div className="flex min-h-screen flex-col"
      style={{ "--page-w": home || search ? "1224px" : "940px" } as CSSProperties}>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main" tabIndex={-1} className={`flex-1 outline-none ${mainClass}`}>
        {home && <div aria-hidden className="sale-pattern" />}
        <PageTransition><Outlet /></PageTransition>
      </main>
      <Footer />
      <ConnectionBanner />
      <p role="status" aria-live="polite" className="sr-only">{message}</p>
      <AddedToCartDialog />
    </div>
  );
}
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LazyImage from "@/components/Layout/LazyImage";

export default function DiscoveryBanner({ images }: { images: string[] }) {
  const { user } = useAuth();
  return (
    <section aria-labelledby="dq-h" className="mx-auto mt-8 max-w-(--page-w) px-3">
      <div className="mb-2 flex items-center gap-4 bg-black/40 py-2 pl-3 pr-6 sm:inline-flex">
        <span aria-hidden className="relative h-10 w-16 shrink-0">
          <span className="absolute left-0 top-1 h-9 w-7 -rotate-12 rounded-sm bg-white/90" />
          <span className="absolute left-4 top-0 h-9 w-7 rounded-sm bg-[#b5522f]" />
          <span className="absolute left-8 top-1 h-9 w-7 rotate-12 rounded-sm bg-[#8c6bc0]" />
        </span>
        <p className="text-sm">
          <strong className="block text-[15px] text-white">Earn free stickers by going through your discovery queue!</strong>
          <span className="text-steam-muted">Available for a limited time</span>
        </p>
      </div>

      <div className="relative isolate h-[150px] overflow-hidden bg-gradient-to-r from-[#5a3a78] via-[#3b5f8f] to-[#2a6a9c]">
        <div aria-hidden className="absolute inset-y-0 right-0 -z-10 flex w-[55%] [mask-image:linear-gradient(to_right,transparent,black_35%)]">
          {images.slice(0, 2).map((src) => <LazyImage key={src} src={src} alt="" className="h-full flex-1" />)}
        </div>
        <div className="p-6">
          <h2 id="dq-h" className="text-[22px] font-medium text-white">Explore Your Discovery Queue</h2>
          <p className="mt-1 text-white">
            {user ? "Top-selling, new and recommended titles, picked for you." : "Sign in to discover top-selling, new and recommended titles."}
          </p>
          <Link to={user ? "/search?filter=topsellers" : "/login"}
            className="mt-3 inline-block bg-[#1a9fff] px-4 py-2 text-sm font-medium text-white transition
              hover:bg-[#47b3ff] active:scale-95 active:bg-[#1385db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {user ? "Start Queue" : "Sign In"}
          </Link>
        </div>
      </div>
    </section>
  );
}
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useImageLoads } from "@/hooks/useImageLoads";

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"loading" | "playing" | "failed">("loading");

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (state === "failed") return null;
  return (
    <video ref={ref} src="/sale-bg.webm" aria-hidden tabIndex={-1} muted loop playsInline autoPlay preload="auto"
      onPlaying={() => setState("playing")} onError={() => setState("failed")}
      className={`pointer-events-none absolute left-1/2 top-0 -z-10 w-[1920px] max-w-none -translate-x-1/2 transition-opacity duration-500
        ${state === "playing" ? "opacity-100" : "opacity-0"}`} />
  );
}

export default function SaleHero() {
  const hasArt = useImageLoads("/sale-bg.webp");
  const [motionOk] = useState(() => !prefersReduced());
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hasArt || !root.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero]", { opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: "power3.out" });
    }, root);
    return () => mm.revert();
  }, [hasArt]);

  if (hasArt) {
    return (
      <div className="h-[465px]">
        <h1 className="sr-only">Freznel Autumn Sale. On now.</h1>
        {motionOk && <HeroVideo />}
      </div>
    );
  }
  return (
    <div ref={root} className="sale-hero-bg h-[465px] overflow-hidden">
      <div className="mx-auto max-w-(--page-w) px-3 pl-[70px] pt-10">
        <h1>
          <span data-hero className="sale-text block text-[clamp(28px,3.4vw,44px)]">Freznel</span>
          <span data-hero className="sale-text block text-[clamp(64px,11vw,170px)]">Autumn</span>
          <span data-hero className="sale-text block text-[clamp(64px,11vw,170px)]">Sale</span>
        </h1>
        <p data-hero className="sale-text mt-3 text-[clamp(18px,2.4vw,36px)]">On now</p>
      </div>
    </div>
  );
}
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import LazyImage from "@/components/Layout/LazyImage";
import type { Category } from "@/models/genres";

const TAGLINES: Record<string, string> = {
  exploration_open_world: "Vast worlds to wander, uncover and get lost in.",
  action: "Fast, loud and relentless.",
  horror: "Don't look behind you.",
  sci_fi: "Tomorrow, today.",
  strategy_war: "Every decision has a cost.",
  casual_family: "Easy to start, hard to put down.",
};

export default function CategoryHero({ category, backdrop }: { category: Category; backdrop?: string }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(root.current!.querySelectorAll("[data-anim]"), {
        opacity: 0, y: 24, duration: 0.6, stagger: 0.12, ease: "power2.out",
      });
    });
    return () => mm.revert();
  }, [category.slug]);

  return (
    <section ref={root} aria-label={`${category.label} hub`} className="relative isolate flex h-[220px] items-end overflow-hidden bg-steam-panel">
      {backdrop && <LazyImage src={backdrop} alt="" className="absolute inset-0 -z-20 h-full w-full opacity-60" />}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-steam-bg via-steam-bg/70 to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-steam-bg/90 to-transparent" />
      <div className="p-6">
        <p data-anim className="text-xs uppercase tracking-[0.3em] text-steam-blue">Content Hub</p>
        <h1 data-anim className="mt-1 text-4xl font-black uppercase tracking-wide text-white">{category.label}</h1>
        <p data-anim className="mt-1 max-w-md text-sm text-steam-text">{TAGLINES[category.slug] ?? "Browse the best of the category."}</p>
      </div>
    </section>
  );
}
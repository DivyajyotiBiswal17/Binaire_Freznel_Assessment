import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";

const COLORS = ["#d9622b", "#e8892f", "#b8431f", "#f0b43c", "#a33a1c", "#c9772a"];
const HEIGHT = 760;

export default function FallingLeaves({ count = 22 }: { count?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const leaves = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      size: 14 + Math.random() * 26,
      color: COLORS[i % COLORS.length],
      soft: Math.random() < 0.3,
    })),
    [count],
  );

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.current!.querySelectorAll<HTMLElement>("[data-leaf]").forEach((el) => {
        gsap.set(el, { y: -60, opacity: 0.9, rotation: Math.random() * 360 });
        gsap.to(el, { y: HEIGHT + 60, duration: 9 + Math.random() * 9, ease: "none", repeat: -1 }).progress(Math.random());
        gsap.to(el, { x: `+=${40 + Math.random() * 70}`, duration: 2.5 + Math.random() * 2.5, ease: "sine.inOut", yoyo: true, repeat: -1 }).progress(Math.random());
        gsap.to(el, { rotation: `+=${(Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 260)}`, duration: 4 + Math.random() * 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    }, root);
    return () => mm.revert();
  }, [leaves]);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden" style={{ height: HEIGHT }}>
      {leaves.map((l, i) => (
        <div key={i} data-leaf className="absolute top-0 opacity-0"
          style={{ left: `${l.left}%`, width: l.size, height: l.size, filter: l.soft ? "blur(1px)" : undefined }}>
          <svg viewBox="0 0 24 24" className="size-full">
            <path d="M12 2C7 6 4 10 5 15c1 4 5 7 7 7s6-3 7-7c1-5-2-9-7-13z" fill={l.color} />
            <path d="M12 6v14M12 12l-3-2M12 15l3-2" stroke="rgba(0,0,0,.28)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  );
}
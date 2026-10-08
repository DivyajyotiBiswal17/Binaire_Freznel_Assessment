import { useEffect, useRef, useState } from "react";
import { lazyLoader, LazyLoader } from "@/utils/LazyLoader";

interface Props { src: string; alt: string; className?: string; }

export default function LazyImage({ src, alt, className = "" }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    setLoaded(false);
    lazyLoader.observe(el, LazyLoader.loadImage);
    return () => lazyLoader.unobserve(el);
  }, [src]);

  return (
    <div className={`overflow-hidden bg-[#223244] ${loaded ? "" : "skeleton"} ${className}`}>
      <img
        ref={ref}
        data-src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
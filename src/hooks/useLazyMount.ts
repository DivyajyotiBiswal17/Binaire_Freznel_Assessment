import { useEffect, useRef, useState } from "react";
import { lazyLoader } from "@/utils/LazyLoader";

export function useLazyMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    lazyLoader.observe(el, () => setVisible(true));
    return () => lazyLoader.unobserve(el);
  }, []);

  return { ref, visible };
}
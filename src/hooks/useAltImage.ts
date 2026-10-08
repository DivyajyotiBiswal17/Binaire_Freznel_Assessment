import { useCallback, useRef, useState } from "react";
import { movieService } from "@/api/MovieService";
import { ApiClient } from "@/api/ApiClient";

export function useAltImage(id: number, fallback: string) {
  const [src, setSrc] = useState(fallback);
  const asked = useRef(false);
  const load = useCallback(() => {
    if (asked.current) return;
    asked.current = true;
    movieService.backdrops(id)
      .then((list) => {
        const pick = list[1] ?? list[0];
        if (pick) setSrc(`${ApiClient.imageBase}/w780${pick}`);
      })
      .catch(() => { asked.current = false; });
  }, [id]);
  return { src, load };
}
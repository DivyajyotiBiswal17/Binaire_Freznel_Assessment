import { CacheManager } from "../offline/CacheManager";
import { LanguageStore } from "@/utils/LanguageStore";
export class ApiClient {
  private readonly base = "https://api.themoviedb.org/3";
  static readonly imageBase = "https://image.tmdb.org/t/p";

  constructor(private cache = new CacheManager()) {}

  async get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    const qs = new URLSearchParams(
      Object.entries({ language: LanguageStore.get(), ...params }).map(([k, v]) => [k, String(v)]),
    );
    const key = `${path}?${qs}`;
    try {
      const res = await fetch(`${this.base}${path}?${qs}`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
      });
      if (!res.ok) throw new Error(`TMDB ${res.status}`);
      const data = (await res.json()) as T;
      void this.cache.set(key, data);
      return data;
    } catch (err) {
      const cached = await this.cache.get<T>(key);
      if (cached) return cached;
      throw err;
    }
  }

  imageUrl(path: string | null, size = "w500"): string {
    return path ? `${ApiClient.imageBase}/${size}${path}` : "";
  }
}

export const api = new ApiClient();
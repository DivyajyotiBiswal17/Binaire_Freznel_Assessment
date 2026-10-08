import { api } from "./ApiClient";
import { StoreItem } from "@/models/StoreItem";
import type { TmdbMovie, TmdbPage } from "@/types/tmdb";

export interface StorePage { items: StoreItem[]; page: number; totalPages: number; totalResults: number; }
export interface DiscoverParams {
  page?: number; sort_by?: string; with_genres?: string; query?: string;
  extra?: Record<string, string | number>;
}
export class MovieService {
  private async load(path: string, params: Record<string, string | number> = {}): Promise<StorePage> {
    const data = await api.get<TmdbPage<TmdbMovie>>(path, params);
    return {
      items: data.results.map((m) => new StoreItem(m)),
      page: data.page,
      totalPages: Math.min(data.total_pages, 500),
      totalResults: data.total_results,
    };
  }

  nowPlaying = (page = 1) => this.load("/movie/now_playing", { page });
  popular = (page = 1) => this.load("/movie/popular", { page });
  upcoming = (page = 1) => this.load("/movie/upcoming", { page });
  trending = (page = 1) => this.load("/trending/movie/week", { page });
  topRated = (page = 1) => this.load("/movie/top_rated", { page });
  discover({ page = 1, sort_by = "popularity.desc", with_genres, query, extra = {} }: DiscoverParams = {}) {
    if (query) return this.load("/search/movie", { page, query });
    const params: Record<string, string | number> = { page, sort_by, include_adult: "false", ...extra };
    if (with_genres) params.with_genres = with_genres;
    return this.load("/discover/movie", params);
  }
  async trendingFree(): Promise<StoreItem[]> {
    const pages = await Promise.all([1, 2, 3].map((p) => this.trending(p)));
    return pages.flatMap((p) => p.items).filter((i) => i.isFree);
  }

  async underPrice(max: number): Promise<StorePage> {
    const pages = await Promise.all([1, 2, 3].map((p) => this.popular(p)));
    const items = pages.flatMap((p) => p.items).filter((i) => !i.isFree && i.finalPrice < max);
    return { items, page: 1, totalPages: 1, totalResults: items.length };
  }

  async backdrops(id: number): Promise<string[]> {
    const d = await api.get<{ backdrops: { file_path: string }[] }>(`/movie/${id}/images`, { include_image_language: "null" });
    return d.backdrops.map((b) => b.file_path);
  }
}
export const movieService = new MovieService();
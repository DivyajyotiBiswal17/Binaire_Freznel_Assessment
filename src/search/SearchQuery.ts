import type { DiscoverParams } from "@/api/MovieService";
import { SortOptions } from "@/sorting/SortOptions";

export type ListFilter = "topsellers" | "popularnew" | "comingsoon" | "trending";
const FILTERS: ListFilter[] = ["topsellers", "popularnew", "comingsoon", "trending"];

export interface QueryState {
  term: string; filter: ListFilter | ""; sort: string;
  genres: number[]; excluded: number[]; minRating: number; page: number;
}

const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
const ids = (v: string | null) => (v ?? "").split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0);

export class SearchQuery {
  readonly state: QueryState;

  constructor(s: Partial<QueryState> = {}) {
    this.state = { term: "", filter: "", sort: "", genres: [], excluded: [], minRating: 0, page: 1, ...s };
  }

  static fromParams(p: URLSearchParams): SearchQuery {
    const filter = p.get("filter") as ListFilter | null;
    const sort = p.get("sort");
    return new SearchQuery({
      term: p.get("term")?.trim() ?? "",
      filter: filter && FILTERS.includes(filter) ? filter : "",
      sort: SortOptions.isValid(sort) ? sort : "",
      genres: ids(p.get("genres")),
      excluded: ids(p.get("exclude")),
      minRating: Number(p.get("rating")) || 0,
      page: Math.max(1, parseInt(p.get("page") ?? "1", 10) || 1),
    });
  }

  toParams(): URLSearchParams {
    const { term, filter, sort, genres, excluded, minRating, page } = this.state;
    const p = new URLSearchParams();
    if (term) p.set("term", term);
    if (filter) p.set("filter", filter);
    if (sort) p.set("sort", sort);
    if (genres.length) p.set("genres", genres.join(","));
    if (excluded.length) p.set("exclude", excluded.join(","));
    if (minRating) p.set("rating", String(minRating));
    if (page > 1) p.set("page", String(page));
    return p;
  }

  patch(changes: Partial<QueryState>): SearchQuery {
    return new SearchQuery({ ...this.state, page: 1, ...changes });
  }

  get isTextSearch() { return this.state.term !== ""; }

  toDiscover(): DiscoverParams {
    const { term, filter, sort, genres, excluded, minRating, page } = this.state;
    if (term) return { page, query: term };

    const extra: Record<string, string | number> = {};
    if (filter === "popularnew") { extra["primary_release_date.gte"] = iso(-90); extra["primary_release_date.lte"] = iso(0); }
    else if (filter === "comingsoon") extra["primary_release_date.gte"] = iso(1);
    else if (filter === "trending") extra["primary_release_date.gte"] = iso(-365);

    if (sort.startsWith("primary_release_date") && !filter) { extra["primary_release_date.lte"] = iso(0); extra["vote_count.gte"] = 20; }
    if (sort === "vote_average.desc") extra["vote_count.gte"] = 200;
    if (minRating) {
      extra["vote_average.gte"] = minRating;
      extra["vote_count.gte"] = Math.max(Number(extra["vote_count.gte"] ?? 0), 50);
    }
    if (excluded.length) extra.without_genres = excluded.join("|");

    return {
      page,
      sort_by: sort || SortOptions.default,
      with_genres: genres.length ? genres.join(",") : undefined,
      extra,
    };
  }
}
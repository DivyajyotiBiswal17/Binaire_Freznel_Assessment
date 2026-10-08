export interface TmdbMovie {
  id: number; title: string; overview: string;
  poster_path: string | null; backdrop_path: string | null;
  release_date: string; vote_average: number; vote_count: number;
  genre_ids: number[]; popularity: number;
}
export interface TmdbPage<T> { page: number; results: T[]; total_pages: number; total_results: number; }
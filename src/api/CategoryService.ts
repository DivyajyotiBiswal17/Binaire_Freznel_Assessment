import { movieService } from "./MovieService";
import type { Category } from "@/models/genres";
import { isoDate } from "@/utils/dates";

export class CategoryService {
  topSellers = (c: Category) => movieService.discover({ with_genres: c.genres });

  newTrending = (c: Category) =>
    movieService.discover({
      with_genres: c.genres,
      sort_by: "primary_release_date.desc",
      extra: { "primary_release_date.lte": isoDate(0), "vote_count.gte": 20 },
    });

  topRated = (c: Category) =>
    movieService.discover({
      with_genres: c.genres,
      sort_by: "vote_average.desc",
      extra: { "vote_count.gte": 500 },
    });

  upcoming = (c: Category) =>
    movieService.discover({
      with_genres: c.genres,
      sort_by: "primary_release_date.asc",
      extra: { "primary_release_date.gte": isoDate(1) },
    });
}
export const categoryService = new CategoryService();
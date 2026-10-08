export const GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary",
  18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller",
  10752: "War", 37: "Western",
};

export interface Category { slug: string; label: string; genres: string; }

export const CATEGORIES: Category[] = [
  { slug: "exploration_open_world", label: "Exploration & Open World", genres: "12|14" },
  { slug: "action", label: "Action", genres: "28" },
  { slug: "horror", label: "Horror", genres: "27" },
  { slug: "sci_fi", label: "Sci-Fi", genres: "878" },
  { slug: "strategy_war", label: "War & Strategy", genres: "10752" },
  { slug: "casual_family", label: "Casual & Family", genres: "10751|16" },
];
export interface SortOption { value: string; label: string; }

export class SortOptions {
  static readonly default = "popularity.desc";
  static readonly all: SortOption[] = [
    { value: "popularity.desc", label: "Relevance" },
    { value: "primary_release_date.desc", label: "Release date (newest)" },
    { value: "primary_release_date.asc", label: "Release date (oldest)" },
    { value: "original_title.asc", label: "Name (A–Z)" },
    { value: "original_title.desc", label: "Name (Z–A)" },
    { value: "vote_average.desc", label: "User reviews" },
    { value: "revenue.desc", label: "Top grossing" },
  ];
  static isValid(v: string | null): v is string { return !!v && this.all.some((o) => o.value === v); }
}
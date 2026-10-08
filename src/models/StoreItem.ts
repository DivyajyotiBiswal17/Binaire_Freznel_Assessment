import { ApiClient } from "@/api/ApiClient";
import { GENRES } from "./genres";
import { inr } from "@/utils/money";
import type { TmdbMovie } from "@/types/tmdb";
const PRICES = [0, 0, 0, 199, 299, 499, 799, 999, 1499, 1999, 2499, 2999, 3999];
const LIGHT = [0, 0, 0, 10, 15, 20, 25, 30];
const DEEP = [50, 60, 75, 90];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export class StoreItem {
  readonly id: number;
  readonly title: string;
  readonly overview: string;
  readonly releaseDate: string;
  readonly raw: TmdbMovie;
  readonly rating: number;
  readonly voteCount: number;
  readonly genreIds: number[];
  readonly price: number;
  readonly discount: number;
  private readonly posterPath: string | null;
  private readonly backdropPath: string | null;

  constructor(raw: TmdbMovie) {
    this.raw = raw;
    this.id = raw.id;
    this.title = raw.title;
    this.overview = raw.overview;
    this.releaseDate = raw.release_date;
    this.rating = raw.vote_average;
    this.voteCount = raw.vote_count;
    this.genreIds = raw.genre_ids ?? [];
    this.posterPath = raw.poster_path;
    this.backdropPath = raw.backdrop_path;

    this.price = PRICES[raw.id % PRICES.length];
    const tier = raw.id >> 3;
    this.discount = this.price === 0 ? 0
      : raw.vote_average >= 8 ? DEEP[tier % DEEP.length]
      : LIGHT[tier % LIGHT.length];
  }

  get isFree() { return this.price === 0; }
  get finalPrice() { return Math.round(this.price * (1 - this.discount / 100)); }
  get priceLabel() {
    if (this.isFree) return "Free";
    return this.discount ? `${this.discount}% off, now ${inr(this.finalPrice)}` : inr(this.price);
  }
  get tags() { return this.genreIds.map((g) => GENRES[g]).filter(Boolean).slice(0, 4); }
  get hasPoster() { return !!this.posterPath; }
  get hasBackdrop() { return !!this.backdropPath; }

  get releaseLabel() {
    return this.releaseDate
      ? new Date(this.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "TBA";
  }
  get releasedLong() {
    const [y, m, d] = this.releaseDate.split("-").map(Number);
    return y ? `${d} ${MONTHS[m - 1]}, ${y}` : "TBA";
  }

  get reviewLabel() {
    if (this.voteCount < 10) return "No user reviews";
    if (this.rating >= 8) return "Very Positive";
    if (this.rating >= 7) return "Mostly Positive";
    if (this.rating >= 5) return "Mixed";
    return "Mostly Negative";
  }
  get reviewSummary() {
    return this.voteCount < 10 ? "No user reviews" : `${this.reviewLabel} (${this.voteCount.toLocaleString("en-US")} reviews)`;
  }

  poster(size = "w185") { return this.posterPath ? `${ApiClient.imageBase}/${size}${this.posterPath}` : ""; }
  backdrop(size = "w780") { return this.backdropPath ? `${ApiClient.imageBase}/${size}${this.backdropPath}` : ""; }
}
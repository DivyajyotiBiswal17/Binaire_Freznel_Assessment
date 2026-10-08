import { CATEGORIES } from "./genres";

export interface MenuItem { label: string; to: string; }
export interface Menu { label: string; items: MenuItem[]; }

const cats = (slugs: string[]): MenuItem[] =>
  CATEGORIES.filter((c) => slugs.includes(c.slug)).map((c) => ({ label: c.label, to: `/category/${c.slug}` }));

export const STORE_MENUS: Menu[] = [
  { label: "Browse", items: [
    { label: "Home", to: "/" },
    { label: "Top Sellers", to: "/search?filter=topsellers" },
    { label: "Popular New Releases", to: "/search?filter=popularnew" },
    { label: "Upcoming Releases", to: "/search?filter=comingsoon" },
  ] },
  { label: "Recommendations", items: [
    { label: "Trending Now", to: "/search?filter=trending" },
    { label: "Top Rated", to: "/search?sort=vote_average.desc" },
  ] },
  { label: "Categories", items: cats(["exploration_open_world", "action", "horror"]) },
  { label: "Ways to Play", items: cats(["casual_family", "strategy_war", "sci_fi"]) },
  { label: "Special Sections", items: [
    { label: "Newest First", to: "/search?sort=primary_release_date.desc" },
    { label: "Name (A–Z)", to: "/search?sort=original_title.asc" },
    { label: "Top Grossing", to: "/search?sort=revenue.desc" },
  ] },
];
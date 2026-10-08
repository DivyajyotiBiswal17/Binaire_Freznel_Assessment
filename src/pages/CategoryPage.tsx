import { Link, useParams } from "react-router-dom";
import { categoryService } from "@/api/CategoryService";
import { useAsync } from "@/hooks/useAsync";
import { CATEGORIES, GENRES, type Category } from "@/models/genres";
import CategoryHero from "@/components/Models/CategoryHero";
import FeaturedCarousel from "@/components/Models/FeaturedCarousel";
import RowSection from "@/components/Models/RowSection";

function CategoryView({ category }: { category: Category }) {
  const top = useAsync(() => categoryService.topSellers(category), [category.slug]);
  const first = category.genres.split("|")[0];
  const searchUrl = (extra = "") => `/search?genres=${first}${extra}`;
  const items = top.data?.items ?? [];
  const offers = items.filter((i) => i.discount > 0);
  const genreIds = category.genres.split("|").map(Number);

  return (
    <div className="space-y-8">
      <CategoryHero category={category} backdrop={items[0]?.backdrop("w1280")} />

      <section aria-labelledby="feat-h">
        <h2 id="feat-h" className="mb-2 text-sm font-medium uppercase tracking-wide text-white">Featured</h2>
        {top.loading ? <div className="skeleton h-[330px]" /> :
         items.length ? <FeaturedCarousel items={items.slice(0, 5)} /> :
         <p className="bg-black/20 p-4 text-sm">Couldn't load featured titles. Connect once to save them for offline use.</p>}
      </section>

      <RowSection title="Top Sellers" seeAllTo={searchUrl()} items={items.length ? items.slice(5) : undefined} load={items.length ? undefined : () => categoryService.topSellers(category)} />
      {offers.length >= 3 && <RowSection title="Special Offers" seeAllTo={searchUrl()} items={offers} />}
      <RowSection title="New & Trending" seeAllTo={searchUrl("&sort=primary_release_date.desc")} load={() => categoryService.newTrending(category)} />
      <RowSection title="Top Rated" seeAllTo={searchUrl("&sort=vote_average.desc")} load={() => categoryService.topRated(category)} />
      <RowSection title="Upcoming" seeAllTo={searchUrl("&filter=comingsoon")} load={() => categoryService.upcoming(category)} />

      <section aria-labelledby="tags-h">
        <h2 id="tags-h" className="mb-2 text-sm font-medium uppercase tracking-wide text-white">Browse by Genre</h2>
        <ul className="flex flex-wrap gap-2">
          {genreIds.map((g) => (
            <li key={g}>
              <Link to={`/search?genres=${g}`}
                className="block bg-gradient-to-r from-[#3d5a73] to-[#1f3346] px-5 py-3 text-sm font-medium text-white transition hover:brightness-125 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steam-blue">
                {GENRES[g]}
              </Link>
            </li>
          ))}
          <li>
            <Link to={searchUrl()}
              className="block bg-steam-blue px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Browse all {category.label} →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return <p className="p-8">Category not found.</p>;
  return <CategoryView key={category.slug} category={category} />;
}
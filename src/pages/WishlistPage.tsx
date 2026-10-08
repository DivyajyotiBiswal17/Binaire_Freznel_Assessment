import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLists } from "@/hooks/useLists";
import ListRow from "@/components/Models/ListRow";
import PriceTag from "@/components/Models/PriceTag";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function WishlistPage() {
  const { wishlist, inCart, add, remove } = useLists();
  const { user, ready } = useAuth();

  return (
    <section aria-labelledby="wish-h">
      <h1 id="wish-h" className="mb-4 text-3xl font-light text-white">Your Wishlist</h1>
      {ready && !user && (
        <p className="mb-4 bg-black/25 p-3 text-sm">
          Your wishlist is saved on this device.{" "}
          <Link to="/login" className="text-steam-blue transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">Sign in</Link> to keep it across devices.
        </p>
      )}

      {wishlist.length === 0 ? (
        <div className="bg-black/25 p-8 text-center">
          <p className="text-lg text-white">Your wishlist is empty.</p>
          <p className="mt-1 text-sm text-steam-muted">Use the heart on any title to save it for later.</p>
          <Link to="/" className={`mt-4 inline-block bg-[#1a9fff] px-5 py-2 text-white transition hover:bg-[#47b3ff] active:scale-95 ${focus}`}>Browse the store</Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {wishlist.map((it) => (
            <li key={it.id}>
              <ListRow item={it}>
                <PriceTag item={it} tone="sale" />
                {inCart(it.id) ? (
                  <Link to="/cart" className={`bg-[#414c5a] px-3 py-1.5 text-sm text-white transition hover:bg-[#4e5d70] active:scale-95 ${focus}`}>In Cart</Link>
                ) : (
                  <button type="button" onClick={() => add("cart", it)}
                    className={`bg-[#5ba32b] px-3 py-1.5 text-sm text-white transition hover:bg-[#6cba33] active:scale-95 ${focus}`}>
                    Add to Cart<span className="sr-only"> {it.title}</span>
                  </button>
                )}
                <button type="button" onClick={() => remove("wishlist", it.id)}
                  className="text-xs text-steam-muted underline transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">
                  Remove<span className="sr-only"> {it.title}</span>
                </button>
              </ListRow>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
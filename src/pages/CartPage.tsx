import { useState } from "react";
import { Link } from "react-router-dom";
import { useLists } from "@/hooks/useLists";
import { inrFull } from "@/utils/money";
import ListRow from "@/components/Models/ListRow";
import PriceTag from "@/components/Models/PriceTag";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function CartPage() {
  const { cart, cartTotal, remove, clearCart } = useLists();
  const [ordered, setOrdered] = useState(false);

  return (
    <section aria-labelledby="cart-h">
      <h1 id="cart-h" className="mb-4 text-3xl font-light text-white">Your Shopping Cart</h1>
      {ordered && <p role="status" className="mb-4 bg-[#4c6b22]/70 p-4 text-sm text-white">Thanks! This is a demo store, so no payment was taken.</p>}

      {cart.length === 0 ? (
        <div className="bg-black/25 p-8 text-center">
          <p className="text-lg text-white">Your cart is empty.</p>
          <Link to="/" className={`mt-4 inline-block bg-[#1a9fff] px-5 py-2 text-white transition hover:bg-[#47b3ff] active:scale-95 ${focus}`}>Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr_280px]">
          <ul className="space-y-2">
            {cart.map((it) => (
              <li key={it.id}>
                <ListRow item={it}>
                  <PriceTag item={it} tone="sale" />
                  <button type="button" onClick={() => remove("cart", it.id)}
                    className="text-xs text-steam-muted underline transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">
                    Remove<span className="sr-only"> {it.title}</span>
                  </button>
                </ListRow>
              </li>
            ))}
          </ul>

          <aside aria-label="Order summary" className="h-fit bg-black/25 p-4">
            <p className="flex justify-between text-sm"><span>Estimated total</span><strong className="text-white">{inrFull(cartTotal)}</strong></p>
            <p className="mt-1 text-xs text-steam-muted">{cart.length} item{cart.length === 1 ? "" : "s"}, discounts included.</p>
            <button type="button" onClick={() => { clearCart(); setOrdered(true); }}
              className={`mt-4 w-full bg-gradient-to-r from-[#75b022] to-[#588a1b] px-4 py-2.5 font-medium text-white transition hover:brightness-110 active:scale-[0.98] ${focus}`}>
              Purchase for myself
            </button>
            <Link to="/" className={`mt-2 block bg-[#414c5a] px-4 py-2.5 text-center text-white transition hover:bg-[#4e5d70] active:scale-[0.98] ${focus}`}>Continue Shopping</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
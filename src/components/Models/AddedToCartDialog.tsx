import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLists } from "@/hooks/useLists";
import { inrFull } from "@/utils/money";

export default function AddedToCartDialog() {
  const { lastAdded: item, cart, remove, dismissAdded } = useLists();
  const ref = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  const btn = "px-4 py-2.5 text-center text-[15px] text-white transition active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <dialog ref={ref} aria-labelledby="added-h" onClose={dismissAdded}
      onClick={(e) => { if (e.target === e.currentTarget) dismissAdded(); }}
      className="m-auto w-[635px] max-w-[calc(100vw-2rem)] border-t border-[#1a9fff] bg-[#2f3a48] p-0 text-steam-text shadow-2xl backdrop:bg-black/75">
      {item && (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 id="added-h" className="text-lg text-[#c6d4df]">Added to your cart!</h2>
            <button type="button" aria-label="Close" onClick={dismissAdded}
              className="p-1 text-white transition hover:text-[#1a9fff] active:scale-90 focus-visible:outline-2 focus-visible:outline-steam-blue">
              <svg viewBox="0 0 16 16" className="size-5" aria-hidden><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2.4" /></svg>
            </button>
          </div>

          <div className="mt-3 flex gap-4 bg-black/25 p-3">
            <img src={item.backdrop("w300")} alt="" className="h-[94px] w-[200px] shrink-0 object-cover" />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <p className="truncate text-base font-medium text-white">{item.title}</p>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <svg viewBox="0 0 16 16" className="mb-2 size-4 text-[#9aa4ad]" aria-hidden>
                    <path d="M1 2.5l6-.8v5.6H1zM8 1.6L15 .6v6.7H8zM1 8.2h6v5.6l-6-.8zM8 8.2h7v6.6l-7-1z" fill="currentColor" />
                  </svg>
                  <label htmlFor="added-for" className="sr-only">Purchase for</label>
                  <select id="added-for" className="bg-[#414c5a] px-2 py-1 text-xs font-semibold text-[#dcdedf] outline-none transition hover:bg-[#4e5d70] focus-visible:outline-2 focus-visible:outline-steam-blue">
                    <option>For my account</option>
                    <option>As a gift</option>
                  </select>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.discount > 0 && <span className="bg-[#4c6b22] px-2 py-1 text-lg font-bold text-[#beee11]">-{item.discount}%</span>}
                    <span className="leading-tight">
                      {item.discount > 0 && <s className="block text-[11px] text-[#738895]">{inrFull(item.price)}</s>}
                      <span className="text-[15px] text-white">{item.isFree ? "Free" : inrFull(item.finalPrice)}</span>
                    </span>
                  </div>
                  <button type="button" onClick={() => remove("cart", item.id)}
                    className="mt-2 text-xs text-[#8f98a0] underline transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={dismissAdded} className={`${btn} bg-[#414c5a] hover:bg-[#4e5d70]`}>Continue Shopping</button>
            <button type="button" onClick={() => { dismissAdded(); navigate("/cart"); }}
              className={`${btn} bg-gradient-to-r from-[#1a9fff] to-[#2f89d6] hover:brightness-110`}>
              View My Cart ({cart.length})
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
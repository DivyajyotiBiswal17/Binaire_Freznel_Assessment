import { useRef } from "react";

export default function GiftCardButton() {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => dlg.current?.showModal()}
        className="inline-flex h-[33px] items-center gap-2.5 rounded-sm bg-gradient-to-r from-[#1a9fff] to-[#47b3ff] pl-3 pr-4 text-[14px] font-semibold text-white shadow-lg transition
          hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <span aria-hidden className="relative h-6 w-8">
          <span className="absolute left-0 top-1 h-5 w-4 -rotate-12 rounded-[2px] bg-white/90" />
          <span className="absolute left-2 top-0 h-5 w-4 rounded-[2px] bg-[#9fd4f7]" />
          <span className="absolute left-4 top-1 h-5 w-4 rotate-12 rounded-[2px] bg-[#1b75bb]" />
        </span>
        Send a Gift Card
      </button>
      <dialog ref={dlg} aria-labelledby="gift-h" className="m-auto max-w-sm rounded-sm bg-steam-bg p-6 text-steam-text backdrop:bg-black/70">
        <h2 id="gift-h" className="text-lg font-medium text-white">Gift cards</h2>
        <p className="mt-2 text-sm">Gift cards aren't available in this demo store.</p>
        <form method="dialog" className="mt-4 text-right">
          <button className="bg-[#1a9fff] px-4 py-1.5 text-sm text-white transition hover:bg-[#47b3ff] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Close</button>
        </form>
      </dialog>
    </>
  );
}
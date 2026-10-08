import type { Pagination } from "@/utils/Pagination";

interface Props { model: Pagination; onChange: (page: number) => void; }

const base = "min-w-9 rounded-sm px-3 py-1.5 text-sm transition active:scale-95 focus-visible:outline-2 focus-visible:outline-steam-blue disabled:pointer-events-none disabled:opacity-40";
const idle = "bg-black/30 hover:bg-[#3d5a73] hover:text-white";
const current = "bg-steam-blue text-black";

export default function PaginationNav({ model, onChange }: Props) {
  if (model.totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-center gap-1">
      <button type="button" disabled={!model.hasPrev} onClick={() => onChange(model.page - 1)}
        aria-label="Previous page" className={`${base} ${idle}`}>‹ Prev</button>

      {model.items().map((it, i) =>
        it === "…" ? (
          <span key={`gap-${i}`} aria-hidden className="px-2 text-steam-muted">…</span>
        ) : (
          <button key={it} type="button" aria-label={`Page ${it}`}
            aria-current={it === model.page ? "page" : undefined}
            onClick={() => onChange(it)}
            className={`${base} ${it === model.page ? current : idle}`}>{it}</button>
        ),
      )}

      <button type="button" disabled={!model.hasNext} onClick={() => onChange(model.page + 1)}
        aria-label="Next page" className={`${base} ${idle}`}>Next ›</button>
    </nav>
  );
}
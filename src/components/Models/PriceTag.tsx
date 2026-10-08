import type { StoreItem } from "@/models/StoreItem";
import { inr } from "@/utils/money";

interface Props { item: StoreItem; tone?: "default" | "sale"; }

export default function PriceTag({ item, tone = "default" }: Props) {
  const sale = tone === "sale";

  if (item.isFree || item.discount === 0) {
    return (
      <span className={`inline-block px-2 py-1 text-sm ${sale ? "bg-[#1a1a1a]/90 font-semibold text-white" : "text-steam-text"}`}>
        {item.isFree ? "Free" : inr(item.price, true)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-stretch overflow-hidden rounded-[2px]">
      <span className="sr-only">{item.priceLabel}</span>
      <span aria-hidden className={`flex items-center px-1.5 font-bold ${sale ? "bg-[#a4d007] text-[13px] text-black" : "bg-steam-discount py-1 text-lg text-steam-green"}`}>
        -{item.discount}%
      </span>
      {sale ? (
        <span aria-hidden className="flex items-center gap-1.5 bg-[#1a1a1a]/90 px-2 py-[3px]">
          <s className="text-[11px] text-steam-muted">{inr(item.price)}</s>
          <span className="text-sm font-semibold text-white">{inr(item.finalPrice, true)}</span>
        </span>
      ) : (
        <span aria-hidden className="bg-black/40 px-2 text-right leading-tight">
          <s className="block text-[11px] text-steam-muted">{inr(item.price)}</s>
          <span className="text-sm text-steam-green">{inr(item.finalPrice)}</span>
        </span>
      )}
    </span>
  );
}
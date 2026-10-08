import type { StoreItem } from "@/models/StoreItem";

export interface FilterState { maxPrice: number; discountsOnly: boolean; hideFree: boolean; hideNoArt: boolean; }

export class ResultFilter {
  static readonly priceSteps = [0, 250, 500, 1000, 1500, 2500, Infinity];
  static readonly defaults: FilterState = { maxPrice: Infinity, discountsOnly: false, hideFree: false, hideNoArt: true };

  static priceLabel(max: number): string {
    if (max === Infinity) return "Any Price";
    if (max === 0) return "Free";
    return `Under ₹${max.toLocaleString("en-IN")}`;
  }

  static apply(items: StoreItem[], f: FilterState): StoreItem[] {
    return items.filter((i) => {
      if (f.hideNoArt && !i.hasBackdrop && !i.hasPoster) return false;
      if (f.hideFree && i.isFree) return false;
      if (f.discountsOnly && i.discount === 0) return false;
      if (f.maxPrice !== Infinity && i.finalPrice > f.maxPrice) return false;
      return true;
    });
  }
}
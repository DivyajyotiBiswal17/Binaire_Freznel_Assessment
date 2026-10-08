import { useSyncExternalStore } from "react";
import { lists } from "@/store/ListsStore";

export function useLists() {
  const v = useSyncExternalStore(lists.subscribe, lists.getSnapshot);
  return {
    ...v,
    inCart: (id: number) => v.cartIds.has(id),
    onWishlist: (id: number) => v.wishIds.has(id),
    add: lists.add, remove: lists.remove, toggleWishlist: lists.toggleWishlist,
    clearCart: lists.clearCart, dismissAdded: lists.dismissAdded,
  };
}
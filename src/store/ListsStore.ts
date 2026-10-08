import { doc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "@/auth/firebase";
import { StoreItem } from "@/models/StoreItem";
import type { TmdbMovie } from "@/types/tmdb";

export type ListName = "cart" | "wishlist";
interface Lists { cart: TmdbMovie[]; wishlist: TmdbMovie[]; }

export interface ListsView {
  cart: StoreItem[]; wishlist: StoreItem[];
  cartIds: Set<number>; wishIds: Set<number>;
  cartTotal: number; lastAdded: StoreItem | null; message: string;
}

const KEY = "freznel-lists:";
const ids = (l: TmdbMovie[]) => l.map((m) => m.id).join(",");

export class ListsStore {
  private lists: Lists = { cart: [], wishlist: [] };
  private lastAdded: StoreItem | null = null;
  private message = "";
  private uid: string | null = null;
  private stopRemote?: Unsubscribe;
  private listeners = new Set<() => void>();
  private view: ListsView;

  constructor() {
    this.lists = this.readLocal("guest");
    this.view = this.build();
  }

  // ---- external-store contract (useSyncExternalStore) ----
  subscribe = (l: () => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  getSnapshot = () => this.view;

  // ---- actions ----
  add = (name: ListName, item: StoreItem) => {
    if (this.lists[name].some((m) => m.id === item.id)) return;
    this.lists = { ...this.lists, [name]: [...this.lists[name], item.raw] };
    if (name === "cart") this.lastAdded = item;
    this.commit(`Added ${item.title} to your ${name}.`);
  };

  remove = (name: ListName, id: number) => {
    const found = this.lists[name].find((m) => m.id === id);
    if (!found) return;
    this.lists = { ...this.lists, [name]: this.lists[name].filter((m) => m.id !== id) };
    if (name === "cart" && this.lastAdded?.id === id) this.lastAdded = null;
    this.commit(`Removed ${found.title} from your ${name}.`);
  };

  toggleWishlist = (item: StoreItem) =>
    this.lists.wishlist.some((m) => m.id === item.id) ? this.remove("wishlist", item.id) : this.add("wishlist", item);

  clearCart = () => {
    this.lists = { ...this.lists, cart: [] };
    this.lastAdded = null;
    this.commit("Your cart is now empty.");
  };

  dismissAdded = () => {
    if (!this.lastAdded) return;
    this.lastAdded = null;
    this.refresh();
  };

  /** Called whenever auth changes. Signed in = sync with Firestore, signed out = guest lists. */
  attach(uid: string | null) {
    if (uid === this.uid) return;
    this.stopRemote?.();
    this.stopRemote = undefined;
    const guest = this.readLocal("guest");
    this.uid = uid;
    this.lastAdded = null;

    if (!uid) { this.lists = guest; this.refresh(); return; }

    this.lists = this.merge(this.readLocal(uid), guest);
    this.writeLocal("guest", null);
    this.refresh();

    let first = true;
    this.stopRemote = onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        const d = snap.data() as Partial<Lists> | undefined;
        const remote: Lists = { cart: d?.cart ?? [], wishlist: d?.wishlist ?? [] };
        if (first) {
          first = false;
          this.lists = this.merge(remote, this.lists);
          const changed = ids(this.lists.cart) !== ids(remote.cart) || ids(this.lists.wishlist) !== ids(remote.wishlist);
          if (changed) this.persist(); else this.writeLocal(uid, this.lists);
        } else {
          this.lists = remote;
          this.writeLocal(uid, remote);
        }
        this.refresh();
      },
      (err) => console.warn("Firestore listener error", err),
    );
  }

  // ---- internals ----
  private commit(message: string) {
    this.message = message;
    this.persist();
    this.refresh();
  }
  private refresh() {
    this.view = this.build();
    this.listeners.forEach((l) => l());
  }
  private persist() {
    this.writeLocal(this.uid ?? "guest", this.lists);
    if (this.uid) setDoc(doc(db, "users", this.uid), this.lists).catch((e) => console.warn("Sync failed", e));
  }
  private merge(a: Lists, b: Lists): Lists {
    const union = (x: TmdbMovie[], y: TmdbMovie[]) => [...x, ...y.filter((m) => !x.some((n) => n.id === m.id))];
    return { cart: union(a.cart, b.cart), wishlist: union(a.wishlist, b.wishlist) };
  }
  private readLocal(key: string): Lists {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY + key) ?? "null");
      return { cart: Array.isArray(raw?.cart) ? raw.cart : [], wishlist: Array.isArray(raw?.wishlist) ? raw.wishlist : [] };
    } catch { return { cart: [], wishlist: [] }; }
  }
  private writeLocal(key: string, lists: Lists | null) {
    try {
      if (lists) localStorage.setItem(KEY + key, JSON.stringify(lists));
      else localStorage.removeItem(KEY + key);
    } catch { /* storage unavailable */ }
  }
  private build(): ListsView {
    const cart = this.lists.cart.map((m) => new StoreItem(m));
    const wishlist = this.lists.wishlist.map((m) => new StoreItem(m));
    return {
      cart, wishlist,
      cartIds: new Set(cart.map((i) => i.id)),
      wishIds: new Set(wishlist.map((i) => i.id)),
      cartTotal: cart.reduce((s, i) => s + i.finalPrice, 0),
      lastAdded: this.lastAdded,
      message: this.message,
    };
  }
}

export const lists = new ListsStore();
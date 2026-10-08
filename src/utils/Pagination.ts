export class Pagination {
  constructor(readonly page: number, readonly totalPages: number, private span = 2) {}

  get hasPrev() { return this.page > 1; }
  get hasNext() { return this.page < this.totalPages; }
  items(): (number | "…")[] {
    const out: (number | "…")[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || Math.abs(i - this.page) <= this.span) out.push(i);
      else if (out[out.length - 1] !== "…") out.push("…");
    }
    return out;
  }
}
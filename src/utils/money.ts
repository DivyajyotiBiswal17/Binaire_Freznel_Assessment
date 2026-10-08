const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
export const inr = (n: number, spaced = false) => `₹${spaced ? " " : ""}${nf.format(n)}`;
export const inrFull = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
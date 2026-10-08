import type { StoreItem } from "@/models/StoreItem";

export default function ReviewIcon({ item }: { item: StoreItem }) {
  const label = item.reviewLabel;
  if (label === "No user reviews") return <span aria-hidden className="size-4" />;

  const positive = label.includes("Positive");
  const mixed = label === "Mixed";
  const tone = positive ? "bg-[#2b5c85] text-[#67c1f5]" : mixed ? "bg-[#6b5a3a] text-[#d9b46a]" : "bg-[#6a2f2f] text-[#e07070]";

  return (
    <span className={`grid size-4 place-items-center rounded-[2px] ${tone}`} title={label}>
      <span className="sr-only">{label}</span>
      {mixed ? (
        <svg aria-hidden viewBox="0 0 16 16" className="size-3"><path d="M3 8h10" stroke="currentColor" strokeWidth="2.4" /></svg>
      ) : (
        <svg aria-hidden viewBox="0 0 16 16" className={`size-3 ${positive ? "" : "rotate-180"}`}>
          <path d="M2 7h3v7H2zM6 7l3-5c1 0 1.8.8 1.5 2L10 6h3.5c.8 0 1.4.7 1.2 1.5l-1 5c-.2.9-.9 1.5-1.8 1.5H6z" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
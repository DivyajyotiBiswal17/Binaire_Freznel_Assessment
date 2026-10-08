export default function PlatformIcons({ id }: { id: number }) {
  return (
    <span aria-hidden className="flex items-center gap-1.5 text-[#8b95a0]">
      <svg viewBox="0 0 16 16" className="size-4"><path d="M1 2.5l6-.8v5.6H1zM8 1.6L15 .6v6.7H8zM1 8.2h6v5.6l-6-.8zM8 8.2h7v6.6l-7-1z" fill="currentColor" /></svg>
      {id % 2 === 0 && (
        <svg viewBox="0 0 16 16" className="size-4"><circle cx="8" cy="9.5" r="5" fill="currentColor" /><path d="M8 4.5C8 3 9 2 10.5 1.8" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
      )}
      {id % 3 === 0 && (
        <svg viewBox="0 0 16 16" className="size-4"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="8" cy="8" r="2.2" fill="currentColor" /></svg>
      )}
    </span>
  );
}
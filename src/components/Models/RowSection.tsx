import { useId } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "@/hooks/useAsync";
import { useLazyMount } from "@/hooks/useLazyMount";
import type { StorePage } from "@/api/MovieService";
import type { StoreItem } from "@/models/StoreItem";
import CapsuleRow from "./CapsuleRow";

interface Props { title: string; seeAllTo?: string; load?: () => Promise<StorePage>; items?: StoreItem[]; }

function Skeleton() {
  return (
    <div className="flex gap-3 overflow-hidden" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => <div key={i} className="skeleton h-[170px] w-[231px] shrink-0" />)}
    </div>
  );
}

function Loader({ title, load }: { title: string; load: () => Promise<StorePage> }) {
  const { data, error } = useAsync(load, []);
  if (error && !data) return <p className="bg-black/20 p-4 text-sm">Couldn't load “{title}”. Connect once to save it for offline use.</p>;
  if (!data) return <Skeleton />;
  if (!data.items.length) return <p className="bg-black/20 p-4 text-sm">Nothing here yet.</p>;
  return <CapsuleRow items={data.items} label={title} />;
}

export default function RowSection({ title, seeAllTo, load, items }: Props) {
  const id = useId();
  const { ref, visible } = useLazyMount<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby={id} className="min-h-[220px]">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 id={id} className="text-sm font-medium uppercase tracking-wide text-white">{title}</h2>
        {seeAllTo && (
          <Link to={seeAllTo} className="text-xs text-steam-blue transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">
            See all
          </Link>
        )}
      </div>
      {items ? <CapsuleRow items={items} label={title} /> : visible && load ? <Loader title={title} load={load} /> : <Skeleton />}
    </section>
  );
}
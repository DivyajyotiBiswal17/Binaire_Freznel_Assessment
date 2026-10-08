import { useEffect, useRef, useState } from "react";
import { useConnectivity } from "@/hooks/useConnectivity";

export default function ConnectionBanner() {
  const status = useConnectivity();
  const prev = useRef(status);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    if (prev.current === "offline" && status === "online") {
      setBackOnline(true);
      const t = setTimeout(() => setBackOnline(false), 3000);
      prev.current = status;
      return () => clearTimeout(t);
    }
    prev.current = status;
  }, [status]);

  const offline = status === "offline";
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      {(offline || backOnline) && (
        <p className={`pointer-events-auto flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold shadow-lg animate-[fade-up_.3s_ease-out]
          ${offline ? "bg-[#5c2a2a] text-red-100" : "bg-steam-discount text-steam-green"}`}>
          <span aria-hidden className={`size-2 rounded-full ${offline ? "bg-red-400" : "bg-steam-green"}`} />
          {offline ? "You're offline. Showing saved data." : "Back online."}
        </p>
      )}
    </div>
  );
}
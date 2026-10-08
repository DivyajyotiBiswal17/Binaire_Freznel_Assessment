import { useState, type InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name"> {
  name: string; label: string; error?: string; hint?: string;
}

export default function TextField({ name, label, error, hint, type = "text", ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  const errId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy = [error && errId, hint && !error && hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={`field-${name}`} className="mb-1 block text-xs font-medium uppercase tracking-wide text-steam-blue">
        {label}
      </label>
      <div className={`flex rounded-sm ring-1 transition hover:bg-[#316282]/60 focus-within:bg-[#316282]/70 focus-within:ring-2 focus-within:ring-steam-blue
        ${error ? "bg-red-950/40 ring-red-400" : "bg-[#316282]/40 ring-transparent"}`}>
        <input
          id={`field-${name}`} name={name} type={isPw && show ? "text" : type}
          aria-invalid={!!error} aria-describedby={describedBy}
          className="w-full bg-transparent px-3 py-2 text-white outline-none placeholder:text-steam-muted"
          {...rest}
        />
        {isPw && (
          <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show}
            className="px-3 text-xs uppercase text-steam-muted transition hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-steam-blue">
            {show ? "Hide" : "Show"}<span className="sr-only"> password</span>
          </button>
        )}
      </div>
      {hint && !error && <p id={hintId} className="mt-1 text-xs text-steam-muted">{hint}</p>}
      {error && <p id={errId} className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}
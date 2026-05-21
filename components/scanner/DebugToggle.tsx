import { DEBUG_COPY } from "@/constants/copy";

interface DebugToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  onLight?: boolean;
}

export default function DebugToggle({
  enabled,
  onChange,
  onLight = false,
}: DebugToggleProps) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 ${
        onLight ? "" : "rounded-xl border border-white/10 bg-white/5 px-4 py-3"
      }`}
    >
      <span
        className={`text-sm ${onLight ? "text-[#5c4a62]/80" : "text-white/70"}`}
      >
        {DEBUG_COPY.label}
      </span>
      <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={enabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-white/15 transition peer-checked:bg-emerald-500/50" />
        <span className="absolute left-0.5 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

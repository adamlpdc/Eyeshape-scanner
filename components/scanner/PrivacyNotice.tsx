import { PRIVACY_COPY } from "@/constants/copy";

interface PrivacyNoticeProps {
  compact?: boolean;
  onLight?: boolean;
}

export default function PrivacyNotice({
  compact = false,
  onLight = false,
}: PrivacyNoticeProps) {
  if (compact) {
    return (
      <p
        className={`flex items-start gap-2 text-sm leading-relaxed ${
          onLight ? "text-[#5c4a62]/80" : "text-white/60"
        }`}
      >
        <ShieldIcon
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            onLight ? "text-[#c41b6a]" : "text-emerald-400/90"
          }`}
        />
        <span>{PRIVACY_COPY.short}</span>
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
          <ShieldIcon className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-medium text-emerald-100">{PRIVACY_COPY.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            {PRIVACY_COPY.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-3Z"
      />
      <path strokeLinecap="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

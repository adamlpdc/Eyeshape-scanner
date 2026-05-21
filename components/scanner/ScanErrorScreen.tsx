import { APP_COPY } from "@/constants/copy";
import { SCAN_ERROR_COPY } from "@/constants/scan";
import type { ScanError } from "@/types/scan";
import Button from "@/components/ui/Button";
import PrivacyNotice from "./PrivacyNotice";

interface ScanErrorScreenProps {
  error: ScanError;
  onRetry: () => void;
}

export default function ScanErrorScreen({ error, onRetry }: ScanErrorScreenProps) {
  const copy = SCAN_ERROR_COPY[error.code];

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-gradient-to-b from-zinc-900 via-black to-black">
      <div className="flex flex-1 flex-col justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
            <ErrorIcon code={error.code} />
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold text-white">
            {copy.title}
          </h1>
          <p className="mt-3 text-center text-base leading-relaxed text-white/70">
            {error.message}
          </p>
          {copy.hint && (
            <p className="mt-2 text-center text-sm text-white/50">{copy.hint}</p>
          )}

          {error.retryHints && error.retryHints.length > 0 && (
            <ul className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/75">
              {error.retryHints.map((hint) => (
                <li key={hint} className="flex gap-2">
                  <span className="text-emerald-400" aria-hidden>
                    •
                  </span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            <Button fullWidth onClick={onRetry}>
              {APP_COPY.retry}
            </Button>
          </div>

          <div className="mt-6">
            <PrivacyNotice compact />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorIcon({ code }: { code: ScanError["code"] }) {
  if (code === "camera_denied") {
    return (
      <svg
        className="h-7 w-7 text-red-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7h2l2-3h8l2 3h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
        />
        <circle cx="12" cy="13" r="3" />
        <path strokeLinecap="round" d="M2 2l20 20" />
      </svg>
    );
  }

  return (
    <svg
      className="h-7 w-7 text-red-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8v5" />
      <circle cx="12" cy="16" r="0.75" fill="currentColor" />
    </svg>
  );
}

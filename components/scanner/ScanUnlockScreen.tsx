"use client";

import { useState, type FormEvent } from "react";
import EylureLogoImage from "@/components/brand/EylureLogoImage";
import { EYLURE_BRAND } from "@/constants/brand";
import { UNLOCK_COPY } from "@/constants/copy";
import type { EyeShape } from "@/types/classification";

interface ScanUnlockScreenProps {
  eyeShape: EyeShape;
  onUnlock: (email: string) => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ScanUnlockScreen({
  eyeShape: _eyeShape,
  onUnlock,
}: ScanUnlockScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const accent = EYLURE_BRAND.accent;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!isValidEmail(trimmed)) {
      setError(UNLOCK_COPY.invalidEmail);
      return;
    }

    setError(null);
    onUnlock(trimmed);
  };

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{ backgroundColor: EYLURE_BRAND.resultsPink }}
    >
      {/* Blurred result cards peeking below the form (reference layout) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 px-5"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        aria-hidden
      >
        <div className="mx-auto flex w-full max-w-md flex-col gap-3 blur-[10px]">
          <div className="h-[4.5rem] rounded-2xl bg-white/95 shadow-sm" />
          <div className="h-[4.5rem] rounded-2xl bg-white/95 shadow-sm" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6">
        <header className="safe-top flex shrink-0 flex-col items-center pt-4 text-center">
          <EylureLogoImage priority />

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 shadow-sm backdrop-blur-[2px]">
            <LockIcon className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              {UNLOCK_COPY.badge}
            </span>
          </div>

          <h1 className="mt-7 max-w-[17rem] text-[1.85rem] font-bold leading-[1.15] tracking-tight text-white sm:max-w-xs sm:text-[2rem]">
            {UNLOCK_COPY.title}
          </h1>
          <p className="mt-3 max-w-[16.5rem] text-[15px] leading-relaxed text-white">
            {UNLOCK_COPY.subtitle}
          </p>
        </header>

        <div className="mt-8 shrink-0 pb-32">
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-md rounded-2xl bg-white px-5 py-6 shadow-[0_10px_40px_rgba(47,36,53,0.14)]"
          >
            <div className="mb-5 flex items-center justify-center gap-2">
              <SparkleIcon className="h-[1.125rem] w-[1.125rem] shrink-0" color={accent} />
              <p className="text-[15px] font-semibold text-[#2f2435]">
                {UNLOCK_COPY.cardTitle}
              </p>
            </div>

            <label htmlFor="unlock-email" className="sr-only">
              {UNLOCK_COPY.emailPlaceholder}
            </label>
            <input
              id="unlock-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder={UNLOCK_COPY.emailPlaceholder}
              className="w-full rounded-xl border border-[#ddd5d9] bg-white px-4 py-4 text-base text-[#2f2435] outline-none transition placeholder:text-[#9a8f96] focus:border-[#EF0078] focus:ring-2 focus:ring-[#EF0078]/15"
            />

            {error && (
              <p className="mt-2 text-sm" style={{ color: accent }} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-4 w-full rounded-xl py-4 text-center text-[15px] font-bold text-white shadow-md transition active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              {UNLOCK_COPY.submit}
            </button>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-[#6b5f66]">
              {UNLOCK_COPY.legalPrefix}{" "}
              <a
                href={UNLOCK_COPY.privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
                style={{ color: accent }}
              >
                {UNLOCK_COPY.privacyLabel}
              </a>{" "}
              and{" "}
              <a
                href={UNLOCK_COPY.termsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
                style={{ color: accent }}
              >
                {UNLOCK_COPY.termsLabel}
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function SparkleIcon({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden
    >
      <path d="M12 2l1.2 4.2L17 8l-4.8 1.2L12 14l-1.2-4.8L6 8l4.8-1.2L12 2Z" />
      <path
        d="M18.5 13.5l.7 2.3L21 16l-2.3.9-.7 2.3-.7-2.3L15 16l2.3-.9.7-2.3Z"
        opacity="0.9"
      />
    </svg>
  );
}

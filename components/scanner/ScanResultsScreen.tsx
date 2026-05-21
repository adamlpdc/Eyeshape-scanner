import Image from "next/image";
import { APP_COPY, DEBUG_COPY } from "@/constants/copy";
import {
  EYE_SHAPE_BEAUTY,
  RESULTS_COPY,
} from "@/constants/eye-shape-beauty";
import { EYLURE_BRAND } from "@/constants/brand";
import { formatShapeLabel } from "@/lib/classification/format-shape-label";
import { formatEyeBlock } from "@/lib/measurements/format-measurements";
import type { EyeShape, EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import DebugToggle from "./DebugToggle";
import LashMapIllustration from "./results/LashMapIllustration";
import PrivacyNotice from "./PrivacyNotice";

interface ScanResultsScreenProps {
  measurements: FaceEyeMeasurements;
  classification: EyeShapeClassification;
  frameCount: number;
  showDebug: boolean;
  onDebugChange: (enabled: boolean) => void;
  onScanAgain: () => void;
}

export default function ScanResultsScreen({
  measurements,
  classification,
  frameCount,
  showDebug,
  onDebugChange,
  onScanAgain,
}: ScanResultsScreenProps) {
  const profile = EYE_SHAPE_BEAUTY[classification.primary];
  const shapeLabel = formatShapeLabel(classification.primary);

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col"
      style={{ backgroundColor: EYLURE_BRAND.pink }}
    >
      <div className="safe-top shrink-0 px-4 pt-4">
        <button
          type="button"
          onClick={onScanAgain}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#2f2435] shadow-sm transition active:scale-[0.98]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          </svg>
          Try Again
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-3">
        <div className="mx-auto w-full max-w-md space-y-4">
          <header className="flex flex-col items-center pt-2 text-center">
            <Image
              src="/eylure-logo-white.png"
              alt="Eylure London"
              width={200}
              height={56}
              className="h-auto w-[min(56vw,180px)] mix-blend-lighten"
            />
          </header>

          <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
            <p className="text-xs font-semibold tracking-wide text-[#5c4a62]/70 uppercase">
              {RESULTS_COPY.yourEyeShape}
            </p>
            <h1 className="mt-1 text-4xl font-bold capitalize text-[#2f2435]">
              {shapeLabel}
            </h1>
            {classification.secondary && (
              <p className="mt-2 text-sm text-[#5c4a62]/80">
                {RESULTS_COPY.alsoPossible}:{" "}
                <span className="font-semibold capitalize text-[#2f2435]">
                  {formatShapeLabel(classification.secondary)}
                </span>
              </p>
            )}

            <h2 className="mt-5 text-sm font-bold text-[#2f2435]">
              {RESULTS_COPY.aboutShape}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#5c4a62]">
              {profile.explanation}
            </p>
          </article>

          <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
            <h2 className="text-sm font-bold text-[#2f2435]">
              {RESULTS_COPY.bestLashStyles}
            </h2>
            <ul className="mt-3 space-y-3">
              {profile.lashStyles.map((style, index) => (
                <li
                  key={style.name}
                  className="flex gap-3 border-t border-[#e8c4cc]/60 pt-3 first:border-0 first:pt-0"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f4a0b0]/40 text-xs font-bold text-[#2f2435]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#2f2435]">{style.name}</p>
                    <p className="mt-0.5 text-sm leading-snug text-[#5c4a62]">
                      {style.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[#2f2435]">
                {RESULTS_COPY.lashMap}
              </h2>
              <span className="rounded-full bg-[#f4a0b0]/30 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#5c4a62]">
                {RESULTS_COPY.mapPlaceholder}
              </span>
            </div>
            <LashMapIllustration label={profile.mapLabel} />
          </article>

          <div className="rounded-2xl bg-[#fff8fa]/80 px-4 py-3">
            <PrivacyNotice compact onLight />
          </div>

          <div className="rounded-2xl bg-[#fff8fa]/80 px-4 py-3">
            <DebugToggle
              enabled={showDebug}
              onChange={onDebugChange}
              onLight
            />
          </div>

          {showDebug && (
            <div className="rounded-2xl border border-[#c41b6a]/20 bg-[#fff8fa] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#5c4a62]">
                {DEBUG_COPY.panelTitle} ({frameCount} frames)
              </p>
              <pre className="mt-3 overflow-x-auto font-mono text-[10px] leading-relaxed text-[#5c4a62]">
                {formatEyeBlock("Left eye", measurements.left)}
                {"\n\n"}
                {formatEyeBlock("Right eye", measurements.right)}
                {"\n\n"}
                {Object.entries(classification.scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(
                    ([shape, score]) =>
                      `  ${formatShapeLabel(shape as EyeShape)}: ${(score * 100).toFixed(0)}%`,
                  )
                  .join("\n")}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="safe-bottom shrink-0 px-4 pb-5 pt-2">
        <button
          type="button"
          onClick={onScanAgain}
          className="w-full rounded-xl bg-white py-4 text-center text-lg font-bold tracking-wide text-[#2f2435] shadow-md transition active:scale-[0.98]"
        >
          {APP_COPY.scanAgain}
        </button>
      </div>
    </div>
  );
}

import { DEBUG_COPY } from "@/constants/copy";
import {
  EYE_SHAPE_BEAUTY,
  RESULTS_COPY,
} from "@/constants/eye-shape-beauty";
import { formatShapeLabel } from "@/lib/classification/format-shape-label";
import { formatEyeBlock } from "@/lib/measurements/format-measurements";
import type { EyeShape, EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import Button from "@/components/ui/Button";
import DebugToggle from "./DebugToggle";
import ConfidenceRing from "./results/ConfidenceRing";
import LashMapIllustration from "./results/LashMapIllustration";
import PrivacyNotice from "./PrivacyNotice";

interface ScanResultsScreenProps {
  measurements: FaceEyeMeasurements;
  classification: EyeShapeClassification;
  scanSessionConfidence: number;
  frameCount: number;
  showDebug: boolean;
  onDebugChange: (enabled: boolean) => void;
  onScanAgain: () => void;
}

export default function ScanResultsScreen({
  measurements,
  classification,
  scanSessionConfidence,
  frameCount,
  showDebug,
  onDebugChange,
  onScanAgain,
}: ScanResultsScreenProps) {
  const profile = EYE_SHAPE_BEAUTY[classification.primary];
  const shapeLabel = formatShapeLabel(classification.primary);

  return (
    <div className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#0c0a0b]">
      <div
        className="results-glow pointer-events-none absolute -top-24 left-1/2 h-72 w-[min(100vw,28rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-rose-400/25 via-rose-300/10 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-48 w-48 rounded-full bg-amber-100/8 blur-3xl"
        aria-hidden
      />

      <div className="safe-top relative flex-1 overflow-y-auto overscroll-contain">
        <div className="px-5 pt-8 pb-32 sm:px-6">
          <header className="results-enter results-enter-1 text-center">
            <p className="text-[11px] font-medium tracking-[0.2em] text-rose-200/55 uppercase">
              {RESULTS_COPY.eyebrow}
            </p>
            <p className="mt-3 text-xs tracking-wide text-white/40">
              {RESULTS_COPY.detected}
            </p>
            <h1 className="font-display mt-1 text-[2.75rem] leading-[1.05] font-medium tracking-tight text-white capitalize sm:text-5xl">
              {shapeLabel}
            </h1>
            <p className="mt-2 text-sm font-light text-rose-100/65">
              {profile.tagline}
            </p>
          </header>

          <div className="results-enter results-enter-2 mt-8 flex justify-center gap-8 rounded-3xl border border-white/[0.07] bg-white/[0.03] px-6 py-5 backdrop-blur-md">
            <ConfidenceRing
              value={classification.confidence}
              label={RESULTS_COPY.confidence}
              accent="rose"
            />
            <div className="w-px shrink-0 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <ConfidenceRing
              value={scanSessionConfidence}
              label={RESULTS_COPY.scanQuality}
              accent="champagne"
            />
          </div>

          {classification.secondary && (
            <p className="results-enter results-enter-2 mt-4 text-center text-xs text-white/45">
              {RESULTS_COPY.alsoPossible}{" "}
              <span className="font-medium text-amber-100/75 capitalize">
                {formatShapeLabel(classification.secondary)}
              </span>
            </p>
          )}

          <section className="results-enter results-enter-3 mt-6 rounded-3xl border border-rose-200/10 bg-gradient-to-br from-rose-950/50 via-[#161214] to-[#100e10] p-5 shadow-[0_20px_50px_-24px_rgba(251,113,133,0.35)]">
            <h2 className="text-[11px] font-medium tracking-[0.18em] text-rose-200/55 uppercase">
              {RESULTS_COPY.aboutShape}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed font-light text-white/82">
              {profile.explanation}
            </p>
          </section>

          <section className="results-enter results-enter-4 mt-5">
            <h2 className="px-1 text-[11px] font-medium tracking-[0.18em] text-rose-200/55 uppercase">
              {RESULTS_COPY.bestLashStyles}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {profile.lashStyles.map((style, index) => (
                <li
                  key={style.name}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-rose-200/15 hover:bg-white/[0.05]"
                  style={{ animationDelay: `${0.32 + index * 0.06}s` }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-300/25 to-amber-200/15 text-[11px] font-medium text-rose-100/90"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white/95">{style.name}</p>
                      <p className="mt-1 text-sm font-light leading-snug text-white/55">
                        {style.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="results-enter results-enter-5 mt-6">
            <div className="mb-3 flex items-end justify-between gap-3 px-1">
              <h2 className="text-[11px] font-medium tracking-[0.18em] text-rose-200/55 uppercase">
                {RESULTS_COPY.lashMap}
              </h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] tracking-wide text-white/35 uppercase">
                {RESULTS_COPY.mapPlaceholder}
              </span>
            </div>
            <LashMapIllustration label={profile.mapLabel} />
          </section>

          <div className="results-enter results-enter-6 mt-6 space-y-4">
            <PrivacyNotice compact />
            <DebugToggle enabled={showDebug} onChange={onDebugChange} />
          </div>

          {showDebug && (
            <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs font-medium tracking-wide text-amber-200/80 uppercase">
                {DEBUG_COPY.panelTitle} ({frameCount} frames)
              </p>
              <pre className="mt-3 overflow-x-auto font-mono text-[10px] leading-relaxed text-white/75 sm:text-xs">
                {formatEyeBlock("Left eye", measurements.left)}
                {"\n\n"}
                {formatEyeBlock("Right eye", measurements.right)}
                {"\n\n"}
                {"Averaged features\n"}
                {`  EAR: ${classification.features.aspectRatio.toFixed(3)}\n`}
                {`  outer ∠: ${classification.features.outerCornerAngleDeg.toFixed(1)}°\n`}
                {`  lid open: ${classification.features.upperEyelidOpenness.toFixed(3)}\n`}
                {`  brow dist: ${classification.features.browDistance.toFixed(3)}\n`}
                {`  iris vis: ${classification.features.irisVisibility.toFixed(3)}\n`}
                {`  tilt: ${classification.features.canthalTilt.toFixed(3)}\n\n`}
                {"Shape scores\n"}
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

      <div className="safe-bottom relative shrink-0 border-t border-white/[0.06] bg-[#0c0a0b]/90 px-5 py-4 backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[#0c0a0b] to-transparent"
          aria-hidden
        />
        <Button
          fullWidth
          onClick={onScanAgain}
          className="bg-gradient-to-r from-rose-100 to-amber-50 text-[#1a1214] shadow-[0_8px_32px_-8px_rgba(251,207,232,0.55)] hover:from-white hover:to-rose-50"
        >
          {RESULTS_COPY.retryScan}
        </Button>
      </div>
    </div>
  );
}

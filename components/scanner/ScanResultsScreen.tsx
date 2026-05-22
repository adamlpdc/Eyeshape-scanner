import { APP_COPY, DEBUG_COPY } from "@/constants/copy";
import { RECOMMENDATION_COPY } from "@/constants/lash-recommendation-engine";
import { LASH_MAP_PROFILES } from "@/constants/lash-map-profiles";
import {
  trackRecommendationClicked,
  trackRetryClicked,
} from "@/lib/analytics";
import { getLashRecommendations } from "@/lib/recommendations/get-lash-recommendations";
import { EYLURE_BRAND } from "@/constants/brand";
import { formatShapeLabel } from "@/lib/classification/format-shape-label";
import { formatEyeBlock } from "@/lib/measurements/format-measurements";
import type { EyeShape, EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import DebugToggle from "./DebugToggle";
import LashMapIllustration from "./results/LashMapIllustration";
import ScanEyePreview from "./results/ScanEyePreview";
import ProductRecommendationCard from "./results/ProductRecommendationCard";
import PrivacyNotice from "./PrivacyNotice";

interface ScanResultsScreenProps {
  measurements: FaceEyeMeasurements;
  classification: EyeShapeClassification;
  frameCount: number;
  scanPreviewImage: string | null;
  showDebug: boolean;
  onDebugChange: (enabled: boolean) => void;
  onScanAgain: () => void;
}

export default function ScanResultsScreen({
  measurements,
  classification,
  frameCount,
  scanPreviewImage,
  showDebug,
  onDebugChange,
  onScanAgain,
}: ScanResultsScreenProps) {
  const profile = getLashRecommendations(classification.primary);
  const lashTip = LASH_MAP_PROFILES[classification.primary].tip;
  const shapeLabel = formatShapeLabel(classification.primary);

  const handleScanAgain = () => {
    trackRetryClicked("results_header");
    onScanAgain();
  };

  const handleRecommendationClick = (product: (typeof profile.products)[number]) => {
    trackRecommendationClicked(product, classification.primary);
  };

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col"
      style={{ backgroundColor: EYLURE_BRAND.resultsPink }}
    >
      <div className="safe-top shrink-0 px-3 pt-3">
        <button
          type="button"
          onClick={handleScanAgain}
          className="inline-flex items-center gap-2 rounded-xl border border-[#e8c4cc]/90 bg-white px-4 py-2.5 text-sm font-semibold text-[#2f2435] shadow-sm transition active:scale-[0.98]"
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
          {APP_COPY.scanAgain}
        </button>
      </div>

      <div className="safe-bottom flex-1 overflow-y-auto overscroll-contain px-3 pb-6 pt-3">
        <div className="w-full space-y-3">
          {scanPreviewImage && <ScanEyePreview imageUrl={scanPreviewImage} />}

          <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
            <div className="flex items-start gap-3">
              <EyeShapeIcon className="mt-0.5 h-8 w-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-[1.75rem] font-bold capitalize leading-tight text-[#2f2435]">
                  {shapeLabel}
                </h1>
              </div>
            </div>

            <h2 className="mt-5 text-sm font-bold text-[#2f2435]">
              {RECOMMENDATION_COPY.aboutShape}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#5c4a62]">
              {profile.explanation}
            </p>
          </article>

          <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
            <h2 className="text-sm font-bold text-[#2f2435]">
              {RECOMMENDATION_COPY.lashRecommendation}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#5c4a62]">
              {lashTip}
            </p>
          </article>

          <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
            <h2 className="text-sm font-bold text-[#2f2435]">
              {RECOMMENDATION_COPY.recommendedProducts}
            </h2>
            <ul className="mt-3 space-y-3">
              {profile.products.map((product) => (
                <li key={product.id}>
                  <ProductRecommendationCard
                    product={product}
                    onProductClick={handleRecommendationClick}
                  />
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl bg-[#fff8fa] p-5 shadow-md">
            <h2 className="mb-4 text-sm font-bold text-[#2f2435]">
              {RECOMMENDATION_COPY.lashMap}
            </h2>
            <LashMapIllustration
              eyeShape={classification.primary}
              label={profile.lashMapLabel}
            />
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
    </div>
  );
}

function EyeShapeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 16c4-7 8-10 12-10s8 3 12 10c-4 7-8 10-12 10S8 23 4 16Z"
        stroke={EYLURE_BRAND.resultsPink}
        strokeWidth="2"
      />
      <circle
        cx="16"
        cy="16"
        r="4"
        stroke={EYLURE_BRAND.resultsPink}
        strokeWidth="2"
      />
    </svg>
  );
}

"use client";

import Image from "next/image";
import { MEDIA_CLASS } from "@/constants/scan";
import {
  isPreviewScreenId,
  PREVIEW_CLASSIFICATION,
  PREVIEW_ERROR,
  PREVIEW_MEASUREMENTS,
  PREVIEW_READINESS_ALIGNING,
  PREVIEW_READINESS_READY,
  type PreviewScreenId,
} from "@/constants/preview-fixtures";
import AlignmentGuideOverlay from "./AlignmentGuideOverlay";
import ScanActionButton from "./ScanActionButton";
import ScanCountdownOverlay from "./ScanCountdownOverlay";
import ScanErrorScreen from "./ScanErrorScreen";
import ScanFetchingScreen from "./ScanFetchingScreen";
import ScanIdleScreen from "./ScanIdleScreen";
import ScanQualityIndicators from "./ScanQualityIndicators";
import ScanResultsScreen from "./ScanResultsScreen";
import ScanUnlockScreen from "./ScanUnlockScreen";
import ScanSweepEffect from "./ScanSweepEffect";
import PrivacyNotice from "./PrivacyNotice";

interface ScannerScreenPreviewProps {
  screen: string;
  fetchingStep?: number;
}

function PreviewCameraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/cat-eye-hero.png"
        alt=""
        fill
        priority
        className={MEDIA_CLASS}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/25" aria-hidden />
    </div>
  );
}

function PreviewScanPhase({
  phase,
  countdown = 3,
  readiness,
}: {
  phase: "aligning" | "countdown" | "scanning";
  countdown?: number;
  readiness: typeof PREVIEW_READINESS_ALIGNING;
}) {
  return (
    <>
      <PreviewCameraBackground />
      <div className="absolute inset-0 z-10 flex flex-col">
        <div className="relative min-h-0 flex-1">
          <ScanQualityIndicators readiness={readiness} />
          <AlignmentGuideOverlay phase={phase} readiness={readiness} />
          {phase === "countdown" && countdown > 0 && (
            <ScanCountdownOverlay value={countdown} />
          )}
          {phase === "scanning" && <ScanSweepEffect />}
        </div>

        {(phase === "aligning" || phase === "countdown") && (
          <ScanActionButton
            phase={phase}
            readiness={readiness}
            isModelReady
          />
        )}

        <div className="shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
          <div className="rounded-xl bg-black/40 px-3 py-3 backdrop-blur-sm">
            <PrivacyNotice compact />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ScannerScreenPreview({
  screen: screenParam,
  fetchingStep,
}: ScannerScreenPreviewProps) {
  const screen: PreviewScreenId = isPreviewScreenId(screenParam)
    ? screenParam
    : "idle";

  return (
    <div className="fixed inset-0 bg-black">
      {screen === "idle" && <ScanIdleScreen onStart={() => {}} />}

      {screen === "error" && (
        <ScanErrorScreen error={PREVIEW_ERROR} onRetry={() => {}} />
      )}

      {screen === "aligning" && (
        <PreviewScanPhase
          phase="aligning"
          readiness={PREVIEW_READINESS_ALIGNING}
        />
      )}

      {screen === "countdown" && (
        <PreviewScanPhase
          phase="countdown"
          countdown={3}
          readiness={PREVIEW_READINESS_READY}
        />
      )}

      {screen === "scanning" && (
        <PreviewScanPhase
          phase="scanning"
          readiness={PREVIEW_READINESS_READY}
        />
      )}

      {screen === "fetching" && (
        <ScanFetchingScreen previewStepIndex={fetchingStep} />
      )}

      {screen === "unlock" && (
        <ScanUnlockScreen
          eyeShape={PREVIEW_CLASSIFICATION.primary}
          onUnlock={() => {}}
        />
      )}

      {screen === "results" && (
        <ScanResultsScreen
          measurements={PREVIEW_MEASUREMENTS}
          classification={PREVIEW_CLASSIFICATION}
          frameCount={42}
          scanPreviewImage="/cat-eye-hero.png"
          showDebug={false}
          onDebugChange={() => {}}
          onScanAgain={() => {}}
        />
      )}
    </div>
  );
}

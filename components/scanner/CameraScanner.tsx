"use client";

import { MEDIA_CLASS } from "@/constants/scan";
import { useScanSession } from "@/hooks/use-scan-session";
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

export default function CameraScanner() {
  const {
    videoRef,
    canvasRef,
    phase,
    isModelReady,
    readiness,
    countdown,
    scanSessionConfidence,
    averagedResults,
    classification,
    scanPreviewImage,
    error,
    showCamera,
    startScan,
    resetScan,
    retry,
    completeUnlock,
  } = useScanSession();

  const showError = phase === "idle" && error !== null;
  const showScanUi =
    phase === "aligning" || phase === "countdown" || phase === "scanning";

  return (
    <div className="fixed inset-0 bg-black">
      <div
        className={`absolute inset-0 overflow-hidden ${showCamera ? "block" : "hidden"}`}
      >
        <video
          ref={videoRef}
          className={MEDIA_CLASS}
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className={`${MEDIA_CLASS} pointer-events-none`}
          aria-hidden
        />
      </div>

      {showScanUi && (
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
              isModelReady={isModelReady}
            />
          )}

          <div className="shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
            <div className="rounded-xl bg-black/40 px-3 py-3 backdrop-blur-sm">
              <PrivacyNotice compact />
            </div>
          </div>
        </div>
      )}

      {phase === "fetching" && <ScanFetchingScreen />}

      {phase === "unlock" && classification && (
        <ScanUnlockScreen
          eyeShape={classification.primary}
          onUnlock={completeUnlock}
        />
      )}

      {phase === "results" && averagedResults && classification && (
        <ScanResultsScreen
          classification={classification}
          scanPreviewImage={scanPreviewImage}
          onScanAgain={resetScan}
        />
      )}

      {showError && <ScanErrorScreen error={error} onRetry={retry} />}

      {phase === "idle" && !error && (
        <ScanIdleScreen onStart={startScan} />
      )}
    </div>
  );
}

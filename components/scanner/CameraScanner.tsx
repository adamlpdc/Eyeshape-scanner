"use client";

import { MEDIA_CLASS } from "@/constants/scan";
import { useDebugMode } from "@/hooks/use-debug-mode";
import { useScanSession } from "@/hooks/use-scan-session";
import AlignmentGuideOverlay from "./AlignmentGuideOverlay";
import ScanErrorScreen from "./ScanErrorScreen";
import ScanIdleScreen from "./ScanIdleScreen";
import ScanProgressOverlay from "./ScanProgressOverlay";
import ScanReadinessPanel from "./ScanReadinessPanel";
import ScanResultsScreen from "./ScanResultsScreen";

export default function CameraScanner() {
  const { showDebug, setShowDebug } = useDebugMode();
  const {
    videoRef,
    canvasRef,
    phase,
    isModelReady,
    readiness,
    captureProgress,
    scanSessionConfidence,
    averagedResults,
    classification,
    capturedFrameCount,
    error,
    showCamera,
    startScan,
    resetScan,
    retry,
  } = useScanSession();

  const showError = phase === "idle" && error !== null;
  const showQualityUi = phase === "aligning" || phase === "capturing";

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

      {showQualityUi && (
        <AlignmentGuideOverlay phase={phase} readiness={readiness} />
      )}

      <ScanReadinessPanel
        phase={phase}
        readiness={readiness}
        isModelReady={isModelReady}
      />

      <ScanProgressOverlay
        phase={phase}
        progress={captureProgress}
        scanSessionConfidence={scanSessionConfidence}
      />

      {phase === "results" && averagedResults && classification && (
        <ScanResultsScreen
          measurements={averagedResults}
          classification={classification}
          scanSessionConfidence={scanSessionConfidence}
          frameCount={capturedFrameCount}
          showDebug={showDebug}
          onDebugChange={setShowDebug}
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

"use client";

import { MEDIA_CLASS } from "@/constants/scan";
import { useDebugMode } from "@/hooks/use-debug-mode";
import { useScanSession } from "@/hooks/use-scan-session";
import AlignmentGuideOverlay from "./AlignmentGuideOverlay";
import ScanActionButton from "./ScanActionButton";
import ScanCountdownOverlay from "./ScanCountdownOverlay";
import ScanErrorScreen from "./ScanErrorScreen";
import ScanFetchingScreen from "./ScanFetchingScreen";
import ScanIdleScreen from "./ScanIdleScreen";
import ScanQualityIndicators from "./ScanQualityIndicators";
import ScanResultsScreen from "./ScanResultsScreen";
import ScanSweepEffect from "./ScanSweepEffect";

export default function CameraScanner() {
  const { showDebug, setShowDebug } = useDebugMode();
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
    capturedFrameCount,
    error,
    showCamera,
    startScan,
    resetScan,
    retry,
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

          {phase === "aligning" && (
            <ScanActionButton
              readiness={readiness}
              isModelReady={isModelReady}
            />
          )}
        </div>
      )}

      {phase === "fetching" && <ScanFetchingScreen />}

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

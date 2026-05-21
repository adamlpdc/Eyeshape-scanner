"use client";

import { MEDIA_CLASS } from "@/constants/scan";
import { useScanSession } from "@/hooks/use-scan-session";
import ScanProgressOverlay from "./ScanProgressOverlay";
import ScanResultsScreen from "./ScanResultsScreen";

export default function CameraScanner() {
  const {
    videoRef,
    canvasRef,
    phase,
    isModelReady,
    captureProgress,
    averagedResults,
    classification,
    capturedFrameCount,
    error,
    showCamera,
    startScan,
    resetScan,
  } = useScanSession();

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

      {phase === "capturing" && (
        <ScanProgressOverlay
          progress={captureProgress}
          isModelReady={isModelReady}
        />
      )}

      {phase === "results" && averagedResults && classification && (
        <ScanResultsScreen
          measurements={averagedResults}
          classification={classification}
          frameCount={capturedFrameCount}
          onScanAgain={resetScan}
        />
      )}

      {phase === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          {error && (
            <p className="max-w-sm text-center text-sm text-red-400">{error}</p>
          )}
          <button
            type="button"
            onClick={startScan}
            className="min-h-14 min-w-[200px] rounded-full bg-white px-8 py-4 text-lg font-semibold text-black shadow-lg active:scale-[0.98]"
          >
            Start scan
          </button>
        </div>
      )}
    </div>
  );
}

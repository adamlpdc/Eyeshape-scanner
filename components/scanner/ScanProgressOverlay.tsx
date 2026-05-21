interface ScanProgressOverlayProps {
  progress: number;
  isModelReady: boolean;
}

export default function ScanProgressOverlay({
  progress,
  isModelReady,
}: ScanProgressOverlayProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-6 pb-10">
      <p className="text-center text-base font-medium text-white sm:text-lg">
        {isModelReady ? "Hold still…" : "Loading face model…"}
      </p>

      <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
          style={{ width: `${isModelReady ? clampedProgress : 0}%` }}
        />
      </div>

      {isModelReady && (
        <p className="font-mono text-sm text-white/70">
          {Math.round(clampedProgress)}%
        </p>
      )}
    </div>
  );
}

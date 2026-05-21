interface ScanCountdownOverlayProps {
  value: number;
}

export default function ScanCountdownOverlay({ value }: ScanCountdownOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm">
        <span
          key={value}
          className="text-6xl font-bold tabular-nums text-white animate-pulse"
        >
          {value}
        </span>
      </div>
    </div>
  );
}

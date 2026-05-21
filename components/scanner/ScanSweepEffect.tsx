export default function ScanSweepEffect() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden
    >
      <div className="scan-sweep-line absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
      <div className="absolute inset-0 bg-emerald-400/5 scan-sweep-glow" />
    </div>
  );
}

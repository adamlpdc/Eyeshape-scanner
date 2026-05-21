import { EYLURE_BRAND } from "@/constants/brand";

export default function ScanSweepEffect() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden
    >
      <div
        className="scan-sweep-line absolute left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${EYLURE_BRAND.pink}, transparent)`,
          boxShadow: `0 0 20px ${EYLURE_BRAND.pink}99`,
        }}
      />
      <div
        className="scan-sweep-glow absolute inset-0"
        style={{ backgroundColor: `${EYLURE_BRAND.pink}14` }}
      />
    </div>
  );
}

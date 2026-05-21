import Image from "next/image";
import { APP_COPY } from "@/constants/copy";
import { EYLURE_BRAND } from "@/constants/brand";

interface ScanIdleScreenProps {
  onStart: () => void;
}

export default function ScanIdleScreen({ onStart }: ScanIdleScreenProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ backgroundColor: EYLURE_BRAND.pink }}
    >
      <header className="safe-top flex shrink-0 flex-col items-center px-6 pt-6">
        <Image
          src="/eylure-logo-white.png"
          alt="Eylure London"
          width={280}
          height={80}
          priority
          className="h-auto w-[min(72vw,220px)] max-w-full mix-blend-lighten"
        />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
          {APP_COPY.analysisTitle}
        </h1>
        <p className="mt-3 max-w-xs text-base text-white/90">
          {APP_COPY.tagline}
        </p>
      </div>

      <div className="safe-bottom px-6 pb-6">
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-xl bg-white py-4 text-center text-lg font-bold tracking-[0.08em] text-[#2f2435] shadow-md transition active:scale-[0.98]"
        >
          {APP_COPY.startLabel}
        </button>
      </div>
    </div>
  );
}

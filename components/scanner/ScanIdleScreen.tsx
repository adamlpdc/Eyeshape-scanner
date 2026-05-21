import Image from "next/image";
import { APP_COPY } from "@/constants/copy";
import EylureLogoImage from "@/components/brand/EylureLogoImage";
import PrivacyNotice from "./PrivacyNotice";

interface ScanIdleScreenProps {
  onStart: () => void;
}

export default function ScanIdleScreen({ onStart }: ScanIdleScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <Image
        src="/cat-eye-hero.png"
        alt=""
        fill
        priority
        className="object-cover object-[center_25%]"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55"
        aria-hidden
      />

      <header className="safe-top relative z-10 flex shrink-0 flex-col items-center px-6 pt-5 text-center">
        <EylureLogoImage priority />

        <h1 className="mt-6 max-w-sm text-2xl font-bold leading-tight text-white drop-shadow-sm sm:text-[1.75rem]">
          {APP_COPY.analysisTitle}
        </h1>
        <p className="mt-3 max-w-xs text-base leading-relaxed text-white/95 drop-shadow-sm">
          {APP_COPY.tagline}
        </p>
      </header>

      <div className="relative flex-1" aria-hidden />

      <div className="safe-bottom relative z-10 px-6 pb-6">
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-xl bg-white py-4 text-center text-lg font-bold tracking-[0.08em] text-[#2f2435] shadow-lg transition active:scale-[0.98]"
        >
          {APP_COPY.startLabel}
        </button>
        <div className="mt-4 rounded-xl bg-black/25 px-3 py-3 backdrop-blur-sm">
          <PrivacyNotice compact />
        </div>
      </div>
    </div>
  );
}

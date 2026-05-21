import Image from "next/image";
import { EYLURE_COPY } from "@/constants/eylure-brand";
import EylureLogo from "@/components/brand/EylureLogo";

interface ScanIdleScreenProps {
  onStart: () => void;
}

export default function ScanIdleScreen({ onStart }: ScanIdleScreenProps) {
  return (
    <div className="eylure-screen absolute inset-0 flex flex-col">
      <div className="relative min-h-0 flex-1">
        <Image
          src="/eylure-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_20%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-eylure-pink/25" aria-hidden />

        <div className="safe-top relative z-10 flex flex-col items-center px-6 pt-6 text-center">
          <EylureLogo />
          <h1 className="mt-8 text-[2rem] font-bold leading-tight tracking-tight text-white drop-shadow-sm">
            {EYLURE_COPY.analysisTitle}
          </h1>
          <p className="mt-2 max-w-xs text-lg font-medium text-white/95">
            {EYLURE_COPY.brandLine}
          </p>
        </div>
      </div>

      <div className="safe-bottom relative z-10 shrink-0 px-5 pb-5">
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-xl bg-white py-4 text-center text-lg font-bold tracking-[0.12em] text-eylure-ink shadow-lg transition active:scale-[0.98]"
        >
          {EYLURE_COPY.start}
        </button>
        <p className="mt-4 px-2 text-center text-xs leading-relaxed text-white/90">
          {EYLURE_COPY.legal.split("Privacy Policy")[0]}
          <span className="underline">Privacy Policy</span>
          {" and "}
          <span className="underline">Terms & Conditions</span>.
        </p>
      </div>
    </div>
  );
}

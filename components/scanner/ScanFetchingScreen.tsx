"use client";

import { useEffect, useState } from "react";
import EylureLogoImage from "@/components/brand/EylureLogoImage";
import { EYLURE_BRAND } from "@/constants/brand";
import { FETCHING_COPY, FETCHING_STEP_MS } from "@/constants/fetching";

const RING_RADIUS = 54;
const RING_STROKE = 10;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ScanFetchingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = FETCHING_COPY.steps[stepIndex] ?? FETCHING_COPY.steps[0];
  const progressOffset =
    RING_CIRCUMFERENCE * (1 - step.progress / 100);

  useEffect(() => {
    if (stepIndex >= FETCHING_COPY.steps.length - 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((current) =>
        Math.min(current + 1, FETCHING_COPY.steps.length - 1),
      );
    }, FETCHING_STEP_MS);

    return () => window.clearTimeout(timer);
  }, [stepIndex]);

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden px-6"
      style={{ backgroundColor: EYLURE_BRAND.resultsPink }}
    >
      <header className="safe-top flex shrink-0 flex-col items-center pt-5 text-center">
        <EylureLogoImage />
        <h1 className="mt-6 max-w-sm text-[1.65rem] font-bold leading-tight text-white">
          {FETCHING_COPY.title}
        </h1>
        <p className="mt-3 max-w-xs text-base leading-relaxed text-white/90">
          {FETCHING_COPY.intro}
        </p>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <div className="relative h-44 w-44">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              stroke="white"
              strokeOpacity="0.35"
              strokeWidth={RING_STROKE}
            />
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              stroke={EYLURE_BRAND.magenta}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={progressOffset}
              className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {step.progress}%
            </span>
          </div>
        </div>

        <p
          className="mt-8 text-center text-lg font-medium text-white"
          key={step.status}
        >
          {step.status}
        </p>
      </div>

      <footer className="safe-bottom shrink-0 pb-8 text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          <span
            className="text-lg font-bold"
            style={{ color: EYLURE_BRAND.magenta }}
          >
            {step.step}
          </span>
        </div>
        <h2
          className="mt-4 text-lg font-bold text-white"
          key={step.title}
        >
          {step.title}
        </h2>
        <p
          className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/90"
          key={step.description}
        >
          {step.description}
        </p>
      </footer>
    </div>
  );
}

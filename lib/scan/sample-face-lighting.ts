import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { SCAN_QUALITY_CONFIG } from "@/constants/scan-quality";
import { getFaceBounds } from "./face-bounds";

let sampleCanvas: HTMLCanvasElement | null = null;

function getSampleCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") {
    return null;
  }
  if (!sampleCanvas) {
    sampleCanvas = document.createElement("canvas");
  }
  return sampleCanvas;
}

export interface LightingSample {
  score: number;
  mean: number;
  stdDev: number;
}

export function sampleFaceLighting(
  video: HTMLVideoElement,
  landmarks: NormalizedLandmark[],
): LightingSample | null {
  const canvas = getSampleCanvas();
  const { videoWidth, videoHeight } = video;

  if (!canvas || videoWidth === 0 || videoHeight === 0) {
    return null;
  }

  const bounds = getFaceBounds(landmarks);
  const padX = bounds.width * videoWidth * 0.08;
  const padY = bounds.height * videoHeight * 0.08;

  const sx = Math.max(0, bounds.minX * videoWidth - padX);
  const sy = Math.max(0, bounds.minY * videoHeight - padY);
  const sw = Math.min(
    videoWidth - sx,
    bounds.width * videoWidth + padX * 2,
  );
  const sh = Math.min(
    videoHeight - sy,
    bounds.height * videoHeight + padY * 2,
  );

  if (sw < 8 || sh < 8) {
    return null;
  }

  const sampleSize = 48;
  canvas.width = sampleSize;
  canvas.height = sampleSize;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return null;
  }

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sampleSize, sampleSize);
  const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);

  let sum = 0;
  const luminances: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    luminances.push(luminance);
    sum += luminance;
  }

  const mean = sum / luminances.length;
  const variance =
    luminances.reduce((acc, value) => acc + (value - mean) ** 2, 0) /
    luminances.length;
  const stdDev = Math.sqrt(variance);

  const { luminance, minLuminanceStdDev } = SCAN_QUALITY_CONFIG;

  let score = 1;

  if (mean < luminance.min) {
    score *= Math.max(0, mean / luminance.min);
  } else if (mean > luminance.max) {
    score *= Math.max(0, 1 - (mean - luminance.max) / 60);
  }

  score *= Math.min(1, stdDev / minLuminanceStdDev);

  return {
    score: Math.max(0, Math.min(1, score)),
    mean,
    stdDev,
  };
}

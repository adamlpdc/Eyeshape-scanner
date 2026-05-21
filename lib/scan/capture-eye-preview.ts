import { FaceLandmarker, type NormalizedLandmark } from "@mediapipe/tasks-vision";
import { EYE_LANDMARK_CONFIG } from "@/constants/eye-landmarks";

const MAX_OUTPUT_WIDTH = 1280;
const JPEG_QUALITY = 0.88;
/** Wide landscape crop — full-width eye-area framing on results. */
const TARGET_ASPECT = 5.56;

function collectEyeRegionIndices(): number[] {
  const indices = new Set<number>();

  for (const eye of Object.values(EYE_LANDMARK_CONFIG)) {
    for (const connection of eye.connections) {
      indices.add(connection.start);
      indices.add(connection.end);
    }
    indices.add(eye.outerCorner);
    indices.add(eye.innerCorner);
    indices.add(eye.upperLid);
    indices.add(eye.lowerLid);
    indices.add(eye.browCenter);
    for (const irisIndex of eye.irisIndices) {
      indices.add(irisIndex);
    }
  }

  return [...indices];
}

const EYE_REGION_INDICES = collectEyeRegionIndices();

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Crops the eye region from a scan frame (on-device). Returns a JPEG data URL
 * or null if capture fails. Output is horizontally mirrored to match the selfie preview.
 */
export function captureEyePreview(
  video: HTMLVideoElement,
  landmarks: NormalizedLandmark[],
): string | null {
  const { videoWidth, videoHeight } = video;
  if (videoWidth === 0 || videoHeight === 0) {
    return null;
  }

  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;

  for (const index of EYE_REGION_INDICES) {
    const point = landmarks[index];
    if (!point) {
      continue;
    }
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  if (maxX <= minX || maxY <= minY) {
    return null;
  }

  const regionWidth = maxX - minX;
  const regionHeight = maxY - minY;
  const padX = regionWidth * 1.44;
  const padY = regionHeight * 0.42;

  let normMinX = clamp01(minX - padX);
  let normMinY = clamp01(minY - padY);
  let normMaxX = clamp01(maxX + padX);
  let normMaxY = clamp01(maxY + padY);

  const cropWidth = normMaxX - normMinX;
  const cropHeight = normMaxY - normMinY;
  const aspect = cropWidth / cropHeight;

  if (aspect < TARGET_ASPECT) {
    const centerX = (normMinX + normMaxX) / 2;
    const targetWidth = cropHeight * TARGET_ASPECT;
    normMinX = clamp01(centerX - targetWidth / 2);
    normMaxX = clamp01(centerX + targetWidth / 2);
  }

  const srcX = Math.floor(normMinX * videoWidth);
  const srcY = Math.floor(normMinY * videoHeight);
  const srcW = Math.max(1, Math.ceil((normMaxX - normMinX) * videoWidth));
  const srcH = Math.max(1, Math.ceil((normMaxY - normMinY) * videoHeight));

  let outW = srcW;
  let outH = srcH;
  if (outW > MAX_OUTPUT_WIDTH) {
    const scale = MAX_OUTPUT_WIDTH / outW;
    outW = MAX_OUTPUT_WIDTH;
    outH = Math.max(1, Math.round(outH * scale));
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  try {
    ctx.translate(outW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } catch {
    return null;
  }
}

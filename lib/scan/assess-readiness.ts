import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import {
  READINESS_SUGGESTIONS,
  SCAN_QUALITY_CONFIG,
} from "@/constants/scan-quality";
import type { ScanReadiness, ScanReadinessIssue } from "@/types/scan-quality";
import { getFaceBounds } from "./face-bounds";
import { sampleFaceLighting, type LightingSample } from "./sample-face-lighting";
import { StillnessTracker } from "./stillness-tracker";

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function scoreRange(
  value: number,
  min: number,
  max: number,
): { score: number; issue: ScanReadinessIssue | null } {
  if (value < min) {
    const ratio = value / min;
    return {
      score: clamp01(ratio),
      issue: "too_far",
    };
  }
  if (value > max) {
    const ratio = (max + (max - min) * 0.5) / value;
    return {
      score: clamp01(ratio),
      issue: "too_close",
    };
  }
  return { score: 1, issue: null };
}

function scoreAlignment(
  centerX: number,
  centerY: number,
): { score: number; issue: ScanReadinessIssue | null } {
  const { faceCenterTarget, maxCenterOffset } = SCAN_QUALITY_CONFIG;
  const offsetX = Math.abs(centerX - faceCenterTarget.x) / maxCenterOffset.x;
  const offsetY = Math.abs(centerY - faceCenterTarget.y) / maxCenterOffset.y;
  const penalty = Math.max(offsetX, offsetY);

  if (penalty > 1) {
    return { score: clamp01(1 - (penalty - 1)), issue: "off_center" };
  }

  return { score: clamp01(1 - penalty * 0.85), issue: null };
}

function scoreLighting(sample: LightingSample | null): {
  score: number;
  issue: ScanReadinessIssue | null;
} {
  if (!sample) {
    return { score: 0.5, issue: null };
  }

  const { luminance, minLuminanceStdDev } = SCAN_QUALITY_CONFIG;

  if (sample.mean < luminance.min) {
    return { score: sample.score, issue: "too_dark" };
  }
  if (sample.mean > luminance.max) {
    return { score: sample.score, issue: "too_bright" };
  }
  if (sample.stdDev < minLuminanceStdDev) {
    return { score: sample.score, issue: "low_contrast" };
  }

  return { score: sample.score, issue: null };
}

function pickPrimaryIssue(
  issues: Array<{ issue: ScanReadinessIssue | null; weight: number }>,
): ScanReadinessIssue | null {
  const ranked = issues
    .filter((entry) => entry.issue !== null)
    .sort((a, b) => b.weight - a.weight);

  return ranked[0]?.issue ?? null;
}

function buildSuggestions(
  rankedIssues: ScanReadinessIssue[],
  overall: number,
): string[] {
  if (rankedIssues.includes("no_face")) {
    return [READINESS_SUGGESTIONS.no_face];
  }

  const suggestions: string[] = [];

  for (const issue of rankedIssues.slice(0, 2)) {
    suggestions.push(READINESS_SUGGESTIONS[issue]);
  }

  if (overall >= SCAN_QUALITY_CONFIG.minOverallConfidence) {
    suggestions.push("Hold still — scan will begin automatically.");
  } else if (suggestions.length === 0) {
    suggestions.push("Adjust position and lighting until confidence is high enough.");
  }

  return [...new Set(suggestions)];
}

const stillnessTracker = new StillnessTracker();
let lastLightingSample: LightingSample | null = null;
let lightingFrameCounter = 0;

export function resetReadinessTracking(): void {
  stillnessTracker.reset();
  lastLightingSample = null;
  lightingFrameCounter = 0;
}

export function assessScanReadiness(
  landmarks: NormalizedLandmark[] | undefined,
  video: HTMLVideoElement | null,
): ScanReadiness {
  if (!landmarks?.length) {
    return {
      faceDetected: false,
      alignment: 0,
      distance: 0,
      lighting: 0,
      stillness: 0,
      overall: 0,
      primaryIssue: "no_face",
      suggestions: [READINESS_SUGGESTIONS.no_face],
      canStartCapture: false,
    };
  }

  const bounds = getFaceBounds(landmarks);
  const distanceResult = scoreRange(
    bounds.width,
    SCAN_QUALITY_CONFIG.faceWidthRatio.min,
    SCAN_QUALITY_CONFIG.faceWidthRatio.max,
  );
  const alignmentResult = scoreAlignment(bounds.centerX, bounds.centerY);

  lightingFrameCounter += 1;
  if (video && lightingFrameCounter % 3 === 0) {
    lastLightingSample = sampleFaceLighting(video, landmarks);
  }
  const lightingResult = scoreLighting(lastLightingSample);

  const stillness = stillnessTracker.push(bounds.centerX, bounds.centerY);
  const stillnessIssue: ScanReadinessIssue | null =
    stillness < 0.55 ? "moving" : null;

  const { featureWeights } = SCAN_QUALITY_CONFIG;
  const overall =
    distanceResult.score * featureWeights.distance +
    alignmentResult.score * featureWeights.alignment +
    lightingResult.score * featureWeights.lighting +
    stillness * featureWeights.stillness;

  const issueEntries = [
    { issue: distanceResult.issue, weight: 1 - distanceResult.score },
    { issue: alignmentResult.issue, weight: 1 - alignmentResult.score },
    { issue: lightingResult.issue, weight: 1 - lightingResult.score },
    { issue: stillnessIssue, weight: 1 - stillness },
  ];

  const primaryIssue = pickPrimaryIssue(issueEntries);

  const rankedIssues = issueEntries
    .filter((entry): entry is { issue: ScanReadinessIssue; weight: number } =>
      entry.issue !== null,
    )
    .sort((a, b) => b.weight - a.weight)
    .map((entry) => entry.issue);

  const roundedOverall = clamp01(overall);

  return {
    faceDetected: true,
    alignment: alignmentResult.score,
    distance: distanceResult.score,
    lighting: lightingResult.score,
    stillness,
    overall: roundedOverall,
    primaryIssue,
    suggestions: buildSuggestions(rankedIssues, roundedOverall),
    canStartCapture: roundedOverall >= SCAN_QUALITY_CONFIG.minOverallConfidence,
  };
}

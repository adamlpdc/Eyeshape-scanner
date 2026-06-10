import type { EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import type { ScanReadiness } from "@/types/scan-quality";
import type { ScanError } from "@/types/scan";

export const PREVIEW_SCREEN_IDS = [
  "idle",
  "error",
  "aligning",
  "countdown",
  "scanning",
  "fetching",
  "unlock",
  "results",
] as const;

export type PreviewScreenId = (typeof PREVIEW_SCREEN_IDS)[number];

export function isPreviewScreenId(value: string): value is PreviewScreenId {
  return (PREVIEW_SCREEN_IDS as readonly string[]).includes(value);
}

export const PREVIEW_READINESS_ALIGNING: ScanReadiness = {
  faceDetected: true,
  alignment: 0.48,
  distance: 0.82,
  lighting: 0.91,
  stillness: 0.74,
  overall: 0.58,
  primaryIssue: "off_center",
  suggestions: ["Centre your face in the oval"],
  canStartCapture: false,
};

export const PREVIEW_READINESS_READY: ScanReadiness = {
  faceDetected: true,
  alignment: 0.94,
  distance: 0.88,
  lighting: 0.92,
  stillness: 0.96,
  overall: 0.93,
  primaryIssue: null,
  suggestions: [],
  canStartCapture: true,
};

export const PREVIEW_ERROR: ScanError = {
  code: "camera_denied",
  message:
    "Allow camera access to scan your eye shape. We only use it while you scan.",
};

const eyeMeasurements = (side: "left" | "right") => ({
  side,
  width: 0.31,
  height: 0.11,
  aspectRatio: 2.82,
  outerCornerAngleDeg: 11.4,
  upperEyelidOpenness: 0.34,
  browDistance: 0.41,
  irisVisibility: 0.54,
  canthalTilt: 4.1,
  confidence: 0.91,
});

export const PREVIEW_MEASUREMENTS: FaceEyeMeasurements = {
  left: eyeMeasurements("left"),
  right: eyeMeasurements("right"),
};

export const PREVIEW_CLASSIFICATION: EyeShapeClassification = {
  primary: "almond",
  confidence: 0.89,
  secondary: "upturned",
  scores: {
    hooded: 0.12,
    almond: 0.89,
    round: 0.45,
    monolid: 0.08,
    upturned: 0.52,
    downturned: 0.15,
  },
  features: {
    aspectRatio: 2.82,
    outerCornerAngleDeg: 11.4,
    upperEyelidOpenness: 0.34,
    browDistance: 0.41,
    irisVisibility: 0.54,
    canthalTilt: 4.1,
  },
};

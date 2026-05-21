import type { ScanErrorCode } from "@/types/scan";

export const SCAN_DURATION_MS = 3000;
export const PROGRESS_UPDATE_MS = 50;

export const MEDIA_CLASS =
  "absolute inset-0 h-full w-full -scale-x-100 object-cover";

export const SCAN_ERROR_COPY: Record<
  ScanErrorCode,
  { title: string; message: string; hint?: string }
> = {
  camera_denied: {
    title: "Camera access needed",
    message:
      "Allow camera access to scan your eye shape. We only use it while you scan.",
    hint: "Check your browser or device settings, then tap Try again.",
  },
  camera_unavailable: {
    title: "No camera found",
    message:
      "We couldn't find a front-facing camera on this device.",
    hint: "Try another device with a selfie camera.",
  },
  no_face: {
    title: "Face not detected",
    message:
      "We couldn't detect your face during the scan. Face the camera in good lighting and hold still.",
    hint: "Remove anything covering your eyes if possible.",
  },
  low_quality: {
    title: "Scan quality too low",
    message:
      "Lighting, distance, or movement affected this scan. Adjust your setup and try again.",
    hint: "Follow the tips below, then tap Try again.",
  },
  landmarker_failed: {
    title: "Scanner couldn't start",
    message:
      "Face detection failed to load. Check your connection for the first visit, then try again.",
  },
  unknown: {
    title: "Something went wrong",
    message: "The scan couldn't complete. Please try again.",
  },
};

export const SCAN_ERRORS = {
  noFace: SCAN_ERROR_COPY.no_face.message,
  landmarkerFailed: SCAN_ERROR_COPY.landmarker_failed.message,
  cameraFailed: SCAN_ERROR_COPY.unknown.message,
} as const;

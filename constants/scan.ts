export const SCAN_DURATION_MS = 3000;
export const PROGRESS_UPDATE_MS = 50;

export const MEDIA_CLASS =
  "absolute inset-0 h-full w-full -scale-x-100 object-cover";

export const SCAN_ERRORS = {
  noFace:
    "No face detected during scan. Try better lighting and hold still.",
  landmarkerFailed: "Face detection failed to start.",
  cameraFailed: "Could not access the camera.",
} as const;

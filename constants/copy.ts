export const APP_COPY = {
  name: "Eye Shape Scanner",
  tagline: "Discover your eye shape in a few seconds",
  startScan: "Start scan",
  scanAgain: "Scan again",
  retry: "Try again",
  holdStill: "Hold still…",
  loadingModel: "Preparing scanner…",
  aligning: "Align your face in the guide",
  scanConfidence: "Scan confidence",
  eyeShapeConfidence: "Shape match",
  prototypeBadge: "Private prototype",
} as const;

export const PRIVACY_COPY = {
  title: "Processed on your device",
  body: "Your camera feed and face landmarks are analyzed locally in your browser. No photos or video are uploaded to our servers.",
  short: "Face processing happens on-device. Nothing is uploaded.",
} as const;

export const DEBUG_COPY = {
  label: "Show debug measurements",
  panelTitle: "Debug measurements",
} as const;

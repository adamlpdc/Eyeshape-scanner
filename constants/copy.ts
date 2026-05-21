export const APP_COPY = {
  name: "Eye Shape Scanner",
  analysisTitle: "Eye Shape Analysis",
  tagline: "Discover your perfect lash match",
  startScan: "Start scan",
  startLabel: "START",
  scanAgain: "Scan again",
  retry: "Try again",
  holdStill: "Hold still",
  holdStillStarting: "Hold still — scan starting…",
  loadingModel: "Preparing scanner…",
  alignFace: "Align face",
  holdHeadInPosition: "Keep your head in position",
  aligning: "Align your face in the oval",
  readyToScan: "Ready — hold still, scan starting soon",
  scanConfidence: "Scan confidence",
  fetchingResults: "Fetching your results…",
  eyeShapeConfidence: "Shape match",
  prototypeBadge: "Private prototype",
} as const;

export function scanStartsAtCopy(minPercent: number): string {
  return `Scan starts at ${minPercent}% confidence`;
}

export const PRIVACY_COPY = {
  title: "Processed on your device",
  body: "Your camera feed and face landmarks are analyzed locally in your browser. No photos or video are uploaded to our servers.",
  short: "Face processing happens on-device. Nothing is uploaded.",
} as const;

export const DEBUG_COPY = {
  label: "Show debug measurements",
  panelTitle: "Debug measurements",
} as const;

export type ScanReadinessIssue =
  | "no_face"
  | "too_close"
  | "too_far"
  | "off_center"
  | "too_dark"
  | "too_bright"
  | "low_contrast"
  | "moving";

export interface ScanReadiness {
  faceDetected: boolean;
  alignment: number;
  distance: number;
  lighting: number;
  stillness: number;
  overall: number;
  primaryIssue: ScanReadinessIssue | null;
  suggestions: string[];
  canStartCapture: boolean;
}

export type ScanPhase =
  | "idle"
  | "aligning"
  | "capturing"
  | "processing"
  | "unlock"
  | "results";

export type ScanErrorCode =
  | "camera_denied"
  | "camera_unavailable"
  | "no_face"
  | "low_quality"
  | "landmarker_failed"
  | "unknown";

export interface ScanError {
  code: ScanErrorCode;
  message: string;
  retryHints?: string[];
}

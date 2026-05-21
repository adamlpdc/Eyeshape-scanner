import type { ScanErrorCode } from "@/types/scan";

export class CameraAccessError extends Error {
  readonly code: ScanErrorCode;

  constructor(code: ScanErrorCode, cause?: unknown) {
    super("Camera access failed");
    this.name = "CameraAccessError";
    this.code = code;
    this.cause = cause;
  }
}

export function mapCameraError(error: unknown): ScanErrorCode {
  if (error instanceof CameraAccessError) {
    return error.code;
  }

  if (error instanceof DOMException) {
    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      return "camera_denied";
    }
    if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      return "camera_unavailable";
    }
    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      return "camera_unavailable";
    }
  }

  return "unknown";
}

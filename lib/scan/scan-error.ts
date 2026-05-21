import { SCAN_ERROR_COPY } from "@/constants/scan";
import type { ScanError, ScanErrorCode } from "@/types/scan";

export function createScanError(
  code: ScanErrorCode,
  message?: string,
  retryHints?: string[],
): ScanError {
  return {
    code,
    message: message ?? SCAN_ERROR_COPY[code].message,
    retryHints,
  };
}

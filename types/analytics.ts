import type { EyeShape } from "@/types/classification";

/** Canonical event names (GA4-compatible snake_case). */
export const ANALYTICS_EVENT = {
  SCAN_STARTED: "scan_started",
  SCAN_COMPLETED: "scan_completed",
  EYE_SHAPE_DETECTED: "eye_shape_detected",
  RETRY_CLICKED: "retry_clicked",
  RECOMMENDATION_CLICKED: "recommendation_clicked",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENT)[keyof typeof ANALYTICS_EVENT];

export type RetryClickSource = "error_screen" | "results_header" | "results_footer";

export interface AnalyticsEventPayloads {
  scan_started: Record<string, never>;
  scan_completed: {
    frameCount: number;
    sessionConfidence: number;
    eyeShape: EyeShape;
  };
  eye_shape_detected: {
    eyeShape: EyeShape;
    confidence: number;
    secondaryEyeShape: EyeShape | null;
  };
  retry_clicked: {
    source: RetryClickSource;
  };
  recommendation_clicked: {
    productId: string;
    productName: string;
    eyeShape: EyeShape;
    hasProductUrl: boolean;
  };
}

export type AnalyticsEvent = {
  [K in AnalyticsEventName]: {
    name: K;
    properties: AnalyticsEventPayloads[K];
  };
}[AnalyticsEventName];

export type AnalyticsHandler = (event: AnalyticsEvent) => void;

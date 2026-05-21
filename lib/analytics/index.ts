export { trackEvent, registerAnalyticsHandler } from "@/lib/analytics/track-event";
export {
  trackScanStarted,
  trackScanCompleted,
  trackEyeShapeDetected,
  trackRetryClicked,
  trackRecommendationClicked,
} from "@/lib/analytics/events";
export { ANALYTICS_EVENT } from "@/types/analytics";
export type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayloads,
  AnalyticsHandler,
  RetryClickSource,
} from "@/types/analytics";

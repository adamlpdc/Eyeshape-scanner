import { trackEvent } from "@/lib/analytics/track-event";
import { ANALYTICS_EVENT } from "@/types/analytics";
import type {
  AnalyticsEventPayloads,
  RetryClickSource,
} from "@/types/analytics";
import type { EyeShape, EyeShapeClassification } from "@/types/classification";
import type { ProductRecommendation } from "@/types/lash-recommendations";

export function trackScanStarted(): void {
  trackEvent(ANALYTICS_EVENT.SCAN_STARTED, {});
}

export function trackScanCompleted(
  properties: AnalyticsEventPayloads["scan_completed"],
): void {
  trackEvent(ANALYTICS_EVENT.SCAN_COMPLETED, properties);
}

export function trackEyeShapeDetected(
  classification: EyeShapeClassification,
): void {
  trackEvent(ANALYTICS_EVENT.EYE_SHAPE_DETECTED, {
    eyeShape: classification.primary,
    confidence: classification.confidence,
    secondaryEyeShape: classification.secondary,
  });
}

export function trackRetryClicked(source: RetryClickSource): void {
  trackEvent(ANALYTICS_EVENT.RETRY_CLICKED, { source });
}

export function trackRecommendationClicked(
  product: ProductRecommendation,
  eyeShape: EyeShape,
): void {
  trackEvent(ANALYTICS_EVENT.RECOMMENDATION_CLICKED, {
    productId: product.id,
    productSku: product.sku,
    productName: product.name,
    eyeShape,
    hasTryOnUrl: Boolean(product.tryOnUrl?.trim()),
    hasProductUrl: Boolean(product.productUrl?.trim()),
  });
}

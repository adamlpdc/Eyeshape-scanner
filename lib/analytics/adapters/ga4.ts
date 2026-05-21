import type { AnalyticsEvent, AnalyticsHandler } from "@/types/analytics";

/**
 * Future GA4 adapter — not wired up yet.
 *
 * Example integration:
 * ```ts
 * import { registerAnalyticsHandler } from "@/lib/analytics/track-event";
 * import { createGa4Handler } from "@/lib/analytics/adapters/ga4";
 *
 * registerAnalyticsHandler(createGa4Handler());
 * ```
 */
export function createGa4Handler(): AnalyticsHandler {
  return (_event: AnalyticsEvent) => {
    // gtag("event", event.name, event.properties);
  };
}

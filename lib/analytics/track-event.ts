import type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayloads,
  AnalyticsHandler,
} from "@/types/analytics";

const handlers = new Set<AnalyticsHandler>();

/** Register a sink (e.g. console, GA4 adapter). Returns an unsubscribe function. */
export function registerAnalyticsHandler(handler: AnalyticsHandler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  properties: AnalyticsEventPayloads[Name],
): void {
  const event = { name, properties } as AnalyticsEvent;

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event.name, event.properties);
  }

  for (const handler of handlers) {
    handler(event);
  }
}

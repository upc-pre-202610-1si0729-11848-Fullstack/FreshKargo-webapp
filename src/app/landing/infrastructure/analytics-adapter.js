export function trackEvent(eventName, payload = {}) {
  console.info(`[FreshKargo Analytics] ${eventName}`, payload);
}

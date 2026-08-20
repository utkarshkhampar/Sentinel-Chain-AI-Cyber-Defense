/**
 * Formats an ISO timestamp as a short relative-time string (e.g. "5m ago").
 * Falls back to a locale date string for anything older than a day.
 */
export function formatRelativeTime(isoTimestamp: string): string {
  const then = new Date(isoTimestamp).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;

  return new Date(isoTimestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

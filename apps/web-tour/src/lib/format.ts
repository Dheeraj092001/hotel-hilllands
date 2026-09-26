/**
 * Format a price in INR
 */
export function formatPrice(
  amount: number,
  options: { compact?: boolean } = {}
): string {
  if (options.compact && amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(1)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a duration in days
 */
export function formatDuration(days: number): string {
  const nights = days - 1;
  return `${days}D / ${nights}N`;
}

/**
 * Pluralize a word
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}
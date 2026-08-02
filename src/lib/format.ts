const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Date columns come back as YYYY-MM-DD. Parsing those directly hands them to
 * `Date` as UTC midnight, which renders as the previous day in any timezone
 * behind UTC — so build the date from its parts instead.
 */
export function formatDate(value: string | null) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  return dateFormat.format(new Date(year, month - 1, day));
}

const timestampFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** For timestamptz columns, which carry a real instant. */
export function formatTimestamp(value: string | null) {
  if (!value) return "—";
  return timestampFormat.format(new Date(value));
}

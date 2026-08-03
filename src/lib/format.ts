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

const PERIODS_PER_MONTH: Record<string, number> = {
  monthly: 1,
  quarterly: 1 / 3,
  annual: 1 / 12,
};

/**
 * Retainers are quoted per billing period, so comparing them to each other —
 * or summing a book of business — means normalising to a monthly figure.
 */
export function monthlyValue(deal: {
  revenue_type?: string | null;
  recurring_amount?: number | null;
  billing_period?: string | null;
}) {
  if (deal.revenue_type !== "retainer" || !deal.recurring_amount) return 0;
  return deal.recurring_amount * (PERIODS_PER_MONTH[deal.billing_period ?? "monthly"] ?? 1);
}

/**
 * What a retainer is worth over its committed term. Without a term there's no
 * defensible total, so it contributes nothing rather than a guess.
 */
export function contractValue(deal: {
  revenue_type?: string | null;
  value?: number | null;
  recurring_amount?: number | null;
  billing_period?: string | null;
  contract_months?: number | null;
}) {
  if (deal.revenue_type !== "retainer") return deal.value ?? 0;
  if (!deal.contract_months) return 0;
  return monthlyValue(deal) * deal.contract_months;
}

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

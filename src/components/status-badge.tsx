const ACCOUNT_STATUS: Record<string, { label: string; className: string }> = {
  prospect: { label: "Prospect", className: "bg-warn/15 text-warn" },
  active_client: { label: "Active client", className: "bg-good/15 text-good" },
  past_client: { label: "Past client", className: "bg-muted/15 text-muted" },
};

export function AccountStatusBadge({ status }: { status: string }) {
  const entry = ACCOUNT_STATUS[status] ?? {
    label: status,
    className: "bg-muted/15 text-muted",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${entry.className}`}
    >
      {entry.label}
    </span>
  );
}

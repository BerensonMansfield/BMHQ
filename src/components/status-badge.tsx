type BadgeEntry = { label: string; className: string };

const NEUTRAL = "bg-muted/15 text-muted";

const ACCOUNT_STATUS: Record<string, BadgeEntry> = {
  prospect: { label: "Prospect", className: "bg-warn/15 text-warn" },
  active_client: { label: "Active client", className: "bg-good/15 text-good" },
  past_client: { label: "Past client", className: NEUTRAL },
};

const PROJECT_STATUS: Record<string, BadgeEntry> = {
  planning: { label: "Planning", className: "bg-accent-soft text-accent" },
  active: { label: "Active", className: "bg-good/15 text-good" },
  on_hold: { label: "On hold", className: "bg-warn/15 text-warn" },
  completed: { label: "Completed", className: NEUTRAL },
  cancelled: { label: "Cancelled", className: "bg-bad/15 text-bad" },
};

const MILESTONE_STATUS: Record<string, BadgeEntry> = {
  pending: { label: "Pending", className: NEUTRAL },
  in_progress: { label: "In progress", className: "bg-accent-soft text-accent" },
  completed: { label: "Completed", className: "bg-good/15 text-good" },
};

const TASK_PRIORITY: Record<string, BadgeEntry> = {
  low: { label: "Low", className: NEUTRAL },
  medium: { label: "Medium", className: NEUTRAL },
  high: { label: "High", className: "bg-warn/15 text-warn" },
  urgent: { label: "Urgent", className: "bg-bad/15 text-bad" },
};

function Badge({ entry }: { entry: BadgeEntry }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${entry.className}`}
    >
      {entry.label}
    </span>
  );
}

function lookup(map: Record<string, BadgeEntry>, status: string): BadgeEntry {
  return map[status] ?? { label: status, className: NEUTRAL };
}

export function AccountStatusBadge({ status }: { status: string }) {
  return <Badge entry={lookup(ACCOUNT_STATUS, status)} />;
}

export function ProjectStatusBadge({ status }: { status: string }) {
  return <Badge entry={lookup(PROJECT_STATUS, status)} />;
}

export function MilestoneStatusBadge({ status }: { status: string }) {
  return <Badge entry={lookup(MILESTONE_STATUS, status)} />;
}

export function TaskPriorityBadge({ priority }: { priority: string }) {
  return <Badge entry={lookup(TASK_PRIORITY, priority)} />;
}

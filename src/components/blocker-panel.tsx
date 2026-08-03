import { daysBlocked, type Blocker } from "@/lib/blockers";
import {
  raiseBlocker,
  resolveBlocker,
  reopenBlocker,
  deleteBlocker,
} from "@/app/(app)/blockers/actions";

type Profile = { id: string; full_name: string | null; email: string };

const SEVERITY: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted/15 text-muted" },
  medium: { label: "Medium", className: "bg-muted/15 text-muted" },
  high: { label: "High", className: "bg-warn/15 text-warn" },
  critical: { label: "Critical", className: "bg-bad/15 text-bad" },
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function BlockerPanel({
  entityType,
  entityId,
  blockers,
  profiles,
  revalidatePath,
}: {
  entityType: "task" | "milestone" | "project";
  entityId: string;
  blockers: Blocker[];
  profiles: Profile[];
  revalidatePath: string;
}) {
  const open = blockers.filter((blocker) => !blocker.resolved_at);
  const cleared = blockers.filter((blocker) => blocker.resolved_at);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-xl">Roadblocks</h2>
        {open.length > 0 && (
          <span className="rounded-full bg-bad/15 px-2.5 py-0.5 text-xs font-medium text-bad">
            {open.length} blocking
          </span>
        )}
      </div>

      {open.length === 0 && cleared.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          Nothing blocking. Raise a roadblock when work is stuck.
        </p>
      )}

      {[...open, ...cleared].map((blocker) => {
        const severity = SEVERITY[blocker.severity] ?? SEVERITY.medium;
        const isOpen = !blocker.resolved_at;
        const days = daysBlocked(blocker.raised_at, blocker.resolved_at);

        return (
          <article
            key={blocker.id}
            className={`rounded-xl border p-4 ${
              isOpen
                ? "border-bad/30 bg-bad/5"
                : "border-border bg-surface opacity-75"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severity.className}`}
              >
                {severity.label}
              </span>
              {blocker.is_client_side && (
                <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  Client side
                </span>
              )}
              <span className="text-xs text-muted">
                {isOpen
                  ? `Blocked ${days} ${days === 1 ? "day" : "days"}`
                  : `Cleared after ${days} ${days === 1 ? "day" : "days"}`}
              </span>
            </div>

            <p className="mt-2 font-medium">{blocker.title}</p>

            {blocker.description && (
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
                {blocker.description}
              </p>
            )}

            <p className="mt-2 text-xs text-muted">
              Owner:{" "}
              {blocker.owner?.full_name ?? blocker.owner?.email ?? "Unassigned"}
            </p>

            {blocker.resolution && (
              <p className="mt-2 border-t border-border pt-2 text-sm text-good">
                {blocker.resolution}
              </p>
            )}

            {isOpen ? (
              <form
                action={resolveBlocker}
                className="mt-3 flex flex-wrap items-end gap-2 border-t border-border pt-3"
              >
                <input type="hidden" name="id" value={blocker.id} />
                <input
                  type="hidden"
                  name="revalidate_path"
                  value={revalidatePath}
                />
                <input
                  name="resolution"
                  placeholder="How did it clear?"
                  className={`${inputClass} min-w-48 flex-1`}
                />
                <button
                  type="submit"
                  className="rounded-lg border border-good px-4 py-2 text-sm font-medium text-good transition-colors hover:bg-good/10"
                >
                  Mark cleared
                </button>
              </form>
            ) : (
              <div className="mt-3 flex gap-4 border-t border-border pt-3">
                <form action={reopenBlocker}>
                  <input type="hidden" name="id" value={blocker.id} />
                  <input
                    type="hidden"
                    name="revalidate_path"
                    value={revalidatePath}
                  />
                  <button
                    type="submit"
                    className="text-xs text-muted transition-colors hover:text-warn"
                  >
                    Reopen
                  </button>
                </form>
                <form action={deleteBlocker}>
                  <input type="hidden" name="id" value={blocker.id} />
                  <input
                    type="hidden"
                    name="revalidate_path"
                    value={revalidatePath}
                  />
                  <button
                    type="submit"
                    className="text-xs text-muted transition-colors hover:text-bad"
                  >
                    Remove
                  </button>
                </form>
              </div>
            )}
          </article>
        );
      })}

      <form
        action={raiseBlocker}
        className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-4"
      >
        <input type="hidden" name="entity_type" value={entityType} />
        <input type="hidden" name="entity_id" value={entityId} />
        <input type="hidden" name="revalidate_path" value={revalidatePath} />

        <div className="flex flex-wrap gap-3">
          <div className="flex min-w-48 flex-1 flex-col gap-1.5">
            <label htmlFor="blocker-title" className="text-xs font-medium">
              What&apos;s stuck?
            </label>
            <input
              id="blocker-title"
              name="title"
              required
              placeholder="Waiting on brand assets from client"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="blocker-severity" className="text-xs font-medium">
              Severity
            </label>
            <select
              id="blocker-severity"
              name="severity"
              defaultValue="medium"
              className={inputClass}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="blocker-owner" className="text-xs font-medium">
              Owner
            </label>
            <select id="blocker-owner" name="owner_id" className={inputClass}>
              <option value="">Unassigned</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.full_name ?? profile.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="blocker-description" className="text-xs font-medium">
            Detail
          </label>
          <textarea
            id="blocker-description"
            name="description"
            rows={2}
            placeholder="What's been tried, and what would unblock it."
            className={inputClass}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="is_client_side"
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Waiting on the client
          </label>

          <button
            type="submit"
            className="rounded-lg border border-bad px-4 py-2 text-sm font-medium text-bad transition-colors hover:bg-bad/10"
          >
            Raise roadblock
          </button>
        </div>
      </form>
    </section>
  );
}

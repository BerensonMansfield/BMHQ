import Link from "next/link";
import { formatTimestamp } from "@/lib/format";
import {
  createActivity,
  deleteActivity,
} from "@/app/(app)/activities/actions";

export type EntityType = "account" | "contact" | "deal" | "project" | "task";

export type Activity = {
  id: string;
  entity_type: string;
  entity_id: string;
  type: string;
  subject: string | null;
  body: string | null;
  occurred_at: string;
  author: { full_name: string | null; email: string } | null;
};

const TYPES: { value: string; label: string }[] = [
  { value: "note", label: "Note" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "status_change", label: "Status change" },
];

const TYPE_LABEL: Record<string, string> = Object.fromEntries(
  TYPES.map((type) => [type.value, type.label])
);

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

/** Where a rolled-up entry actually lives, so it stays clickable. */
function entityHref(entityType: string, entityId: string) {
  switch (entityType) {
    case "account":
      return `/accounts/${entityId}`;
    case "contact":
      return `/contacts/${entityId}`;
    case "deal":
      return `/deals/${entityId}`;
    case "project":
      return `/projects/${entityId}`;
    default:
      return null;
  }
}

export function ActivityTimeline({
  entityType,
  entityId,
  activities,
  revalidatePath,
  /** Set when the list includes entries logged against related records. */
  showSource = false,
  emptyMessage = "Nothing logged yet. Add the first note, call, or meeting.",
}: {
  entityType: EntityType;
  entityId: string;
  activities: Activity[];
  revalidatePath: string;
  showSource?: boolean;
  emptyMessage?: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl">Activity</h2>

      <form
        action={createActivity}
        className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-4"
      >
        <input type="hidden" name="entity_type" value={entityType} />
        <input type="hidden" name="entity_id" value={entityId} />
        <input type="hidden" name="revalidate_path" value={revalidatePath} />

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="activity-type" className="text-xs font-medium">
              Type
            </label>
            <select
              id="activity-type"
              name="type"
              defaultValue="note"
              className={inputClass}
            >
              {TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-w-48 flex-1 flex-col gap-1.5">
            <label htmlFor="activity-subject" className="text-xs font-medium">
              Subject
            </label>
            <input
              id="activity-subject"
              name="subject"
              placeholder="Kickoff call with Dana"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="activity-when" className="text-xs font-medium">
              When
            </label>
            <input
              id="activity-when"
              name="occurred_at"
              type="datetime-local"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="activity-body" className="text-xs font-medium">
            Details
          </label>
          <textarea
            id="activity-body"
            name="body"
            rows={3}
            placeholder="What happened, and what comes next."
            className={inputClass}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
          >
            Log it
          </button>
        </div>
      </form>

      {activities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          {emptyMessage}
        </p>
      ) : (
        <ol className="flex flex-col">
          {activities.map((activity) => {
            const isRelated =
              showSource &&
              !(
                activity.entity_type === entityType &&
                activity.entity_id === entityId
              );
            const href = isRelated
              ? entityHref(activity.entity_type, activity.entity_id)
              : null;

            return (
              <li
                key={activity.id}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {/* Rail: a dot on a line, so entries read as a sequence. */}
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span className="w-px flex-1 bg-border" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-xs font-medium uppercase tracking-[0.06em] text-accent">
                      {TYPE_LABEL[activity.type] ?? activity.type}
                    </span>
                    <span className="text-xs text-muted">
                      {formatTimestamp(activity.occurred_at)}
                    </span>
                    {href && (
                      <>
                        <span className="text-xs text-muted">·</span>
                        <Link
                          href={href}
                          className="text-xs text-muted transition-colors hover:text-accent"
                        >
                          on this {activity.entity_type}
                        </Link>
                      </>
                    )}
                  </div>

                  {activity.subject && (
                    <p className="mt-1 font-medium">{activity.subject}</p>
                  )}

                  {activity.body && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
                      {activity.body}
                    </p>
                  )}

                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="text-xs text-muted">
                      {activity.author?.full_name ??
                        activity.author?.email ??
                        "Unknown"}
                    </span>
                    <form action={deleteActivity}>
                      <input type="hidden" name="id" value={activity.id} />
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
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

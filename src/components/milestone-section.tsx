import Link from "next/link";
import { MilestoneStatusBadge } from "@/components/status-badge";
import { StatusSelect } from "@/components/status-select";
import { formatDate } from "@/lib/format";
import {
  createMilestone,
  setMilestoneStatus,
  deleteMilestone,
} from "@/app/(app)/projects/[id]/actions";

type Milestone = {
  id: string;
  name: string;
  due_date: string | null;
  status: string;
};

type TaskSummary = { milestone_id: string | null; status: string };

const MILESTONE_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export function MilestoneSection({
  projectId,
  milestones,
  tasks,
}: {
  projectId: string;
  milestones: Milestone[];
  tasks: TaskSummary[];
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl">Milestones</h2>

      {milestones.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          No milestones yet. Add checkpoints to track this project against.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {milestones.map((milestone) => {
            const milestoneTasks = tasks.filter(
              (task) => task.milestone_id === milestone.id
            );
            const doneCount = milestoneTasks.filter(
              (task) => task.status === "done"
            ).length;

            return (
            <li
              key={milestone.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/projects/${projectId}/milestones/${milestone.id}`}
                  className="font-medium hover:text-accent"
                >
                  {milestone.name}
                </Link>
                <p className="text-xs text-muted">
                  Due {formatDate(milestone.due_date)}
                  {milestoneTasks.length > 0 && (
                    <> · {doneCount} of {milestoneTasks.length} tasks done</>
                  )}
                </p>
              </div>

              <MilestoneStatusBadge status={milestone.status} />

              <form action={setMilestoneStatus}>
                <input type="hidden" name="id" value={milestone.id} />
                <input type="hidden" name="project_id" value={projectId} />
                <StatusSelect
                  name="status"
                  defaultValue={milestone.status}
                  options={MILESTONE_OPTIONS}
                  label={`Status for ${milestone.name}`}
                />
              </form>

              <form action={deleteMilestone}>
                <input type="hidden" name="id" value={milestone.id} />
                <input type="hidden" name="project_id" value={projectId} />
                <button
                  type="submit"
                  className="text-xs text-muted transition-colors hover:text-bad"
                >
                  Remove
                </button>
              </form>
            </li>
            );
          })}
        </ol>
      )}

      <form
        action={createMilestone}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface-2 p-4"
      >
        <input type="hidden" name="project_id" value={projectId} />

        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <label htmlFor="milestone-name" className="text-xs font-medium">
            New milestone
          </label>
          <input
            id="milestone-name"
            name="name"
            required
            placeholder="Discovery complete"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="milestone-due" className="text-xs font-medium">
            Due
          </label>
          <input
            id="milestone-due"
            name="due_date"
            type="date"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
        >
          Add
        </button>
      </form>
    </section>
  );
}

import Link from "next/link";
import { formatDate } from "@/lib/format";
import { StatusSelect } from "@/components/status-select";
import {
  createTask,
  setTaskStatus,
  deleteTask,
} from "@/app/(app)/projects/[id]/actions";

type Subtask = {
  id: string;
  title: string;
  status: string;
  assignee_id: string | null;
  due_date: string | null;
};

type Profile = { id: string; full_name: string | null; email: string };

const STATUSES = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "in_review", label: "In review" },
  { value: "done", label: "Done" },
];

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function SubtaskList({
  projectId,
  parentTaskId,
  subtasks,
  profiles,
}: {
  projectId: string;
  parentTaskId: string;
  subtasks: Subtask[];
  profiles: Profile[];
}) {
  const done = subtasks.filter((task) => task.status === "done").length;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-xl">Subtasks</h2>
        {subtasks.length > 0 && (
          <span className="text-sm text-muted">
            {done} of {subtasks.length} done
          </span>
        )}
      </div>

      {subtasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          No subtasks. Break this down if it&apos;s more than one sitting.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {subtasks.map((subtask) => {
            const assignee = profiles.find(
              (profile) => profile.id === subtask.assignee_id
            );

            return (
              <li
                key={subtask.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/projects/${projectId}/tasks/${subtask.id}`}
                    className={`font-medium hover:text-accent ${
                      subtask.status === "done"
                        ? "text-muted line-through"
                        : ""
                    }`}
                  >
                    {subtask.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {assignee?.full_name ?? assignee?.email ?? "Unassigned"}
                    {subtask.due_date && ` · ${formatDate(subtask.due_date)}`}
                  </p>
                </div>

                <form action={setTaskStatus}>
                  <input type="hidden" name="id" value={subtask.id} />
                  <input type="hidden" name="project_id" value={projectId} />
                  <StatusSelect
                    name="status"
                    defaultValue={subtask.status}
                    options={STATUSES}
                    label={`Status for ${subtask.title}`}
                  />
                </form>

                <form action={deleteTask}>
                  <input type="hidden" name="id" value={subtask.id} />
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
        </ul>
      )}

      <form
        action={createTask}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface-2 p-4"
      >
        <input type="hidden" name="project_id" value={projectId} />
        <input type="hidden" name="parent_task_id" value={parentTaskId} />

        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <label htmlFor="subtask-title" className="text-xs font-medium">
            New subtask
          </label>
          <input
            id="subtask-title"
            name="title"
            required
            placeholder="Pull the competitor screenshots"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="subtask-assignee" className="text-xs font-medium">
            Assignee
          </label>
          <select
            id="subtask-assignee"
            name="assignee_id"
            className={inputClass}
          >
            <option value="">Unassigned</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name ?? profile.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="subtask-due" className="text-xs font-medium">
            Due
          </label>
          <input
            id="subtask-due"
            name="due_date"
            type="date"
            className={inputClass}
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

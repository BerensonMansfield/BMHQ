import Link from "next/link";
import { TaskPriorityBadge } from "@/components/status-badge";
import { StatusSelect } from "@/components/status-select";
import { formatDate } from "@/lib/format";
import {
  createTask,
  setTaskStatus,
  deleteTask,
} from "@/app/(app)/projects/[id]/actions";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  milestone_id: string | null;
  assignee: { full_name: string | null; email: string } | null;
};

type MilestoneOption = { id: string; name: string };
type Profile = { id: string; full_name: string | null; email: string };

const COLUMNS = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "in_review", label: "In review" },
  { value: "done", label: "Done" },
];

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function TaskBoard({
  projectId,
  tasks,
  milestones,
  profiles,
  heading = "Tasks",
  defaultMilestoneId,
  subtaskProgress,
  blockedTaskIds,
}: {
  projectId: string;
  tasks: Task[];
  milestones: MilestoneOption[];
  profiles: Profile[];
  heading?: string;
  /** Preselects the milestone on the quick-add form. */
  defaultMilestoneId?: string;
  /** Done/total per parent task, for the progress hint on a card. */
  subtaskProgress?: Map<string, { done: number; total: number }>;
  /** Tasks carrying an unresolved roadblock. */
  blockedTaskIds?: Set<string>;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl">{heading}</h2>

      <form
        action={createTask}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface-2 p-4"
      >
        <input type="hidden" name="project_id" value={projectId} />

        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <label htmlFor="task-title" className="text-xs font-medium">
            New task
          </label>
          <input
            id="task-title"
            name="title"
            required
            placeholder="Draft the creative brief"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-milestone" className="text-xs font-medium">
            Milestone
          </label>
          <select
            id="task-milestone"
            name="milestone_id"
            defaultValue={defaultMilestoneId ?? ""}
            className={inputClass}
          >
            <option value="">None</option>
            {milestones.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-assignee" className="text-xs font-medium">
            Assignee
          </label>
          <select id="task-assignee" name="assignee_id" className={inputClass}>
            <option value="">Unassigned</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name ?? profile.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-priority" className="text-xs font-medium">
            Priority
          </label>
          <select
            id="task-priority"
            name="priority"
            defaultValue="medium"
            className={inputClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-due" className="text-xs font-medium">
            Due
          </label>
          <input
            id="task-due"
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

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.value
            );

            return (
              <div
                key={column.value}
                className="flex w-64 shrink-0 flex-col gap-3"
              >
                <header className="flex items-baseline justify-between border-b border-border pb-2">
                  <h3 className="text-sm font-medium">{column.label}</h3>
                  <span className="text-xs tabular-nums text-muted">
                    {columnTasks.length}
                  </span>
                </header>

                <div className="flex flex-col gap-2">
                  {columnTasks.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted">
                      Empty
                    </p>
                  )}

                  {columnTasks.map((task) => {
                    const progress = subtaskProgress?.get(task.id);
                    const isBlocked = blockedTaskIds?.has(task.id) ?? false;

                    return (
                    <article
                      key={task.id}
                      className={`flex flex-col gap-2 rounded-lg border bg-surface p-3 ${
                        isBlocked ? "border-bad/40" : "border-border"
                      }`}
                    >
                      <Link
                        href={`/projects/${projectId}/tasks/${task.id}`}
                        className="text-sm font-medium transition-colors hover:text-accent"
                      >
                        {task.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                        <TaskPriorityBadge priority={task.priority} />
                        {isBlocked && (
                          <span className="inline-flex items-center rounded-full bg-bad/15 px-2 py-0.5 font-medium text-bad">
                            Blocked
                          </span>
                        )}
                        {progress && (
                          <span className="tabular-nums">
                            {progress.done}/{progress.total} subtasks
                          </span>
                        )}
                        {task.due_date && (
                          <span className="tabular-nums">
                            {formatDate(task.due_date)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted">
                        {task.assignee?.full_name ??
                          task.assignee?.email ??
                          "Unassigned"}
                        {task.milestone_id && (
                          <>
                            {" · "}
                            <Link
                              href={`/projects/${projectId}/milestones/${task.milestone_id}`}
                              className="hover:text-accent"
                            >
                              {
                                milestones.find(
                                  (milestone) =>
                                    milestone.id === task.milestone_id
                                )?.name
                              }
                            </Link>
                          </>
                        )}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <form action={setTaskStatus}>
                          <input type="hidden" name="id" value={task.id} />
                          <input
                            type="hidden"
                            name="project_id"
                            value={projectId}
                          />
                          <StatusSelect
                            name="status"
                            defaultValue={task.status}
                            options={COLUMNS}
                            label={`Status for ${task.title}`}
                          />
                        </form>

                        <form action={deleteTask}>
                          <input type="hidden" name="id" value={task.id} />
                          <input
                            type="hidden"
                            name="project_id"
                            value={projectId}
                          />
                          <button
                            type="submit"
                            className="text-xs text-muted transition-colors hover:text-bad"
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                    </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

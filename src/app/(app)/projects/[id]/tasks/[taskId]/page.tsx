import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { SubtaskList } from "@/components/subtask-list";
import { BlockerPanel } from "@/components/blocker-panel";
import { ActivityTimeline } from "@/components/activity-timeline";
import { getActivities } from "@/lib/activities";
import { getBlockers } from "@/lib/blockers";
import { updateTask, deleteTask } from "../../actions";

type Subtask = {
  id: string;
  title: string;
  status: string;
  assignee_id: string | null;
  due_date: string | null;
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) {
  const { id, taskId } = await params;
  const supabase = await createClient();

  const [
    { data: task },
    { data: subtasks },
    { data: milestones },
    { data: profiles },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, project:projects(id, name)")
      .eq("id", taskId)
      .eq("project_id", id)
      .single(),
    supabase
      .from("tasks")
      .select("id, title, status, assignee_id, due_date")
      .eq("parent_task_id", taskId)
      .order("created_at"),
    supabase
      .from("milestones")
      .select("id, name")
      .eq("project_id", id)
      .order("sort_order", { nullsFirst: false }),
    supabase.from("profiles").select("id, full_name, email").order("full_name"),
  ]);

  if (!task) notFound();

  const [activities, blockers] = await Promise.all([
    getActivities([taskId]),
    getBlockers([taskId]),
  ]);

  const project = task.project as { id: string; name: string };
  const rows = (subtasks ?? []) as Subtask[];

  return (
    <>
      <PageHeader
        title={task.title}
        description={`Task in ${project.name}`}
      />

      <div className="flex max-w-3xl flex-col gap-10 px-8 pb-16">
        <Link
          href={`/projects/${project.id}`}
          className="-mt-4 text-sm text-muted transition-colors hover:text-accent"
        >
          ← Back to {project.name}
        </Link>

        <section className="rounded-xl border border-border bg-surface p-6">
          <form action={updateTask} className="flex flex-col gap-5">
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="project_id" value={project.id} />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={task.title}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={task.description ?? ""}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={task.status}
                  className={inputClass}
                >
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="in_review">In review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue={task.priority}
                  className={inputClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="assignee_id" className="text-sm font-medium">
                  Assignee
                </label>
                <select
                  id="assignee_id"
                  name="assignee_id"
                  defaultValue={task.assignee_id ?? ""}
                  className={inputClass}
                >
                  <option value="">Unassigned</option>
                  {(profiles ?? []).map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.full_name ?? profile.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="milestone_id" className="text-sm font-medium">
                  Milestone
                </label>
                <select
                  id="milestone_id"
                  name="milestone_id"
                  defaultValue={task.milestone_id ?? ""}
                  className={inputClass}
                >
                  <option value="">None</option>
                  {(milestones ?? []).map((milestone) => (
                    <option key={milestone.id} value={milestone.id}>
                      {milestone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="start_date" className="text-sm font-medium">
                  Start date
                </label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={task.start_date ?? ""}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="due_date" className="text-sm font-medium">
                  Due date
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  defaultValue={task.due_date ?? ""}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="estimated_hours"
                  className="text-sm font-medium"
                >
                  Estimated hours
                </label>
                <input
                  id="estimated_hours"
                  name="estimated_hours"
                  type="number"
                  step="0.25"
                  min="0"
                  defaultValue={task.estimated_hours ?? ""}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="actual_hours" className="text-sm font-medium">
                  Actual hours
                </label>
                <input
                  id="actual_hours"
                  name="actual_hours"
                  type="number"
                  step="0.25"
                  min="0"
                  defaultValue={task.actual_hours ?? ""}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Save changes
              </button>
            </div>
          </form>
        </section>

        <SubtaskList
          projectId={project.id}
          parentTaskId={task.id}
          subtasks={rows}
          profiles={profiles ?? []}
        />

        <BlockerPanel
          entityType="task"
          entityId={task.id}
          blockers={blockers}
          profiles={profiles ?? []}
          revalidatePath={`/projects/${project.id}/tasks/${task.id}`}
        />

        <ActivityTimeline
          entityType="task"
          entityId={task.id}
          activities={activities}
          revalidatePath={`/projects/${project.id}/tasks/${task.id}`}
        />

        <div className="border-t border-border pt-6">
          <form action={deleteTask}>
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="project_id" value={project.id} />
            <input type="hidden" name="return_to_project" value="1" />
            <DeleteButton
              confirmText={`Delete "${task.title}"? Its subtasks go too. This can't be undone.`}
            />
          </form>
        </div>
      </div>
    </>
  );
}

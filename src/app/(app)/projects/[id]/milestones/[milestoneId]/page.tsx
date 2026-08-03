import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { TaskBoard } from "@/components/task-board";
import { BlockerPanel } from "@/components/blocker-panel";
import { ActivityTimeline } from "@/components/activity-timeline";
import { getActivities } from "@/lib/activities";
import { getBlockers } from "@/lib/blockers";
import { updateMilestone, deleteMilestone } from "../../actions";

type TaskRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  milestone_id: string | null;
  assignee: { full_name: string | null; email: string } | null;
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent";

export default async function MilestoneDetailPage({
  params,
}: {
  params: Promise<{ id: string; milestoneId: string }>;
}) {
  const { id, milestoneId } = await params;
  const supabase = await createClient();

  const [{ data: milestone }, { data: tasks, error: tasksError }, { data: profiles }] =
    await Promise.all([
      supabase
        .from("milestones")
        .select("*, project:projects(id, name)")
        .eq("id", milestoneId)
        .eq("project_id", id)
        .single(),
      supabase
        .from("tasks")
        .select(
          "id, title, status, priority, due_date, milestone_id, assignee:profiles!tasks_assignee_id_fkey(full_name, email)"
        )
        .eq("milestone_id", milestoneId)
        // Subtasks belong on their parent's page, not this board.
        .is("parent_task_id", null)
        .order("created_at"),
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name"),
    ]);

  if (!milestone) notFound();

  const [activities, blockers] = await Promise.all([
    getActivities([milestoneId]),
    getBlockers([milestoneId]),
  ]);

  const project = milestone.project as { id: string; name: string };

  return (
    <>
      <PageHeader
        title={milestone.name}
        description={`Milestone in ${project.name}`}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16">
        <Link
          href={`/projects/${project.id}`}
          className="-mt-4 text-sm text-muted transition-colors hover:text-accent"
        >
          ← Back to {project.name}
        </Link>

        <section className="rounded-xl border border-border bg-surface p-6">
          <form action={updateMilestone} className="flex flex-col gap-5">
            <input type="hidden" name="id" value={milestone.id} />
            <input type="hidden" name="project_id" value={project.id} />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={milestone.name}
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
                  defaultValue={milestone.status}
                  className={inputClass}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="due_date" className="text-sm font-medium">
                  Due date
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  defaultValue={milestone.due_date ?? ""}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="owner_id" className="text-sm font-medium">
                  Owner
                </label>
                <select
                  id="owner_id"
                  name="owner_id"
                  defaultValue={milestone.owner_id ?? ""}
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

              <label className="flex items-end gap-2.5 pb-2.5 text-sm">
                <input
                  type="checkbox"
                  name="is_client_facing"
                  defaultChecked={milestone.is_client_facing}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                A client deliverable, not an internal step
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={milestone.description ?? ""}
                className={inputClass}
              />
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

        {tasksError && (
          <p className="rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
            Couldn&apos;t load this milestone&apos;s tasks: {tasksError.message}
          </p>
        )}

        <TaskBoard
          projectId={project.id}
          tasks={(tasks ?? []) as unknown as TaskRow[]}
          milestones={[{ id: milestone.id, name: milestone.name }]}
          profiles={profiles ?? []}
          heading="Tasks in this milestone"
          defaultMilestoneId={milestone.id}
        />

        <BlockerPanel
          entityType="milestone"
          entityId={milestone.id}
          blockers={blockers}
          profiles={profiles ?? []}
          revalidatePath={`/projects/${project.id}/milestones/${milestone.id}`}
        />

        <ActivityTimeline
          entityType="milestone"
          entityId={milestone.id}
          activities={activities}
          revalidatePath={`/projects/${project.id}/milestones/${milestone.id}`}
        />

        <div className="border-t border-border pt-6">
          <form action={deleteMilestone}>
            <input type="hidden" name="id" value={milestone.id} />
            <input type="hidden" name="project_id" value={project.id} />
            <input type="hidden" name="return_to_project" value="1" />
            <DeleteButton
              confirmText={`Delete ${milestone.name}? Its tasks stay in the project but lose this milestone.`}
            />
          </form>
        </div>
      </div>
    </>
  );
}

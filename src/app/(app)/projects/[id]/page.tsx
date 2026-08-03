import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ProjectStatusBadge } from "@/components/status-badge";
import { MilestoneSection } from "@/components/milestone-section";
import { TaskBoard } from "@/components/task-board";
import { ActivityTimeline } from "@/components/activity-timeline";
import { BlockerPanel } from "@/components/blocker-panel";
import { getActivities } from "@/lib/activities";
import { getBlockers } from "@/lib/blockers";
import { currency, formatDate } from "@/lib/format";

type TaskRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  milestone_id: string | null;
  parent_task_id: string | null;
  assignee: { full_name: string | null; email: string } | null;
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: project },
    { data: milestones, error: milestonesError },
    { data: tasks, error: tasksError },
    { data: profiles },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "*, account:accounts(id, name), deal:deals(id, name), owner:profiles(full_name, email)"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("milestones")
      .select("id, name, due_date, status")
      .eq("project_id", id)
      .order("sort_order", { nullsFirst: false })
      .order("due_date", { nullsFirst: false }),
    supabase
      .from("tasks")
      // tasks points at profiles twice (assignee_id and created_by), so the
      // embed has to name which foreign key it means.
      .select(
        "id, title, status, priority, due_date, milestone_id, parent_task_id, assignee:profiles!tasks_assignee_id_fkey(full_name, email)"
      )
      .eq("project_id", id)
      .order("created_at"),
    supabase.from("profiles").select("id, full_name, email").order("full_name"),
  ]);

  if (!project) notFound();

  const allTasks = (tasks ?? []) as unknown as TaskRow[];
  // The board shows top-level work; subtasks live on their parent's page.
  const topLevelTasks = allTasks.filter((task) => !task.parent_task_id);

  const [activities, blockers] = await Promise.all([
    getActivities([id]),
    getBlockers([id, ...allTasks.map((task) => task.id)]),
  ]);

  const subtaskProgress = new Map<string, { done: number; total: number }>();
  for (const task of allTasks) {
    if (!task.parent_task_id) continue;
    const entry = subtaskProgress.get(task.parent_task_id) ?? {
      done: 0,
      total: 0,
    };
    entry.total += 1;
    if (task.status === "done") entry.done += 1;
    subtaskProgress.set(task.parent_task_id, entry);
  }

  const blockedTaskIds = new Set(
    blockers
      .filter((blocker) => !blocker.resolved_at && blocker.entity_type === "task")
      .map((blocker) => blocker.entity_id)
  );
  const projectBlockers = blockers.filter(
    (blocker) => blocker.entity_type === "project"
  );

  const account = project.account as { id: string; name: string } | null;
  const deal = project.deal as { id: string; name: string } | null;
  const owner = project.owner as {
    full_name: string | null;
    email: string;
  } | null;

  return (
    <>
      <PageHeader
        title={project.name}
        description={account ? account.name : "Internal project"}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16">
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ProjectStatusBadge status={project.status} />
            <Link
              href={`/projects/${project.id}/edit`}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              Edit project
            </Link>
          </div>

          {project.description && (
            <p className="max-w-2xl text-sm text-muted">
              {project.description}
            </p>
          )}

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Client
              </dt>
              <dd className="mt-1">
                {account ? (
                  <Link
                    href={`/accounts/${account.id}`}
                    className="hover:text-accent"
                  >
                    {account.name}
                  </Link>
                ) : (
                  <span className="italic text-muted">Internal</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Lead
              </dt>
              <dd className="mt-1">
                {owner?.full_name ?? owner?.email ?? "—"}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Dates
              </dt>
              <dd className="mt-1 tabular-nums">
                {formatDate(project.start_date)} → {formatDate(project.due_date)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Budget
              </dt>
              <dd className="mt-1 tabular-nums">
                {project.budget === null ? "—" : currency.format(project.budget)}
              </dd>
            </div>
          </dl>

          {deal && (
            <p className="border-t border-border pt-4 text-sm text-muted">
              Won from{" "}
              <Link href={`/deals/${deal.id}`} className="hover:text-accent">
                {deal.name}
              </Link>
            </p>
          )}
        </section>

        {(milestonesError || tasksError) && (
          <p className="rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
            Couldn&apos;t load this project&apos;s work:{" "}
            {(milestonesError ?? tasksError)?.message}
          </p>
        )}

        <MilestoneSection
          projectId={project.id}
          milestones={milestones ?? []}
          tasks={allTasks}
        />

        <TaskBoard
          projectId={project.id}
          tasks={topLevelTasks}
          milestones={milestones ?? []}
          profiles={profiles ?? []}
          subtaskProgress={subtaskProgress}
          blockedTaskIds={blockedTaskIds}
        />

        <BlockerPanel
          entityType="project"
          entityId={project.id}
          blockers={projectBlockers}
          profiles={profiles ?? []}
          revalidatePath={`/projects/${project.id}`}
        />

        <ActivityTimeline
          entityType="project"
          entityId={project.id}
          activities={activities}
          revalidatePath={`/projects/${project.id}`}
        />
      </div>
    </>
  );
}

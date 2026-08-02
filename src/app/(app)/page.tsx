import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatTile } from "@/components/stat-tile";
import { PipelineChart } from "@/components/pipeline-chart";
import {
  ProjectStatusBadge,
  TaskPriorityBadge,
} from "@/components/status-badge";
import { currency, formatDate } from "@/lib/format";

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

type DealRow = { stage_id: string; value: number | null };
type TaskRow = {
  id: string;
  title: string;
  due_date: string | null;
  priority: string;
  project: { id: string; name: string } | null;
};
type ProjectRow = {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  account: { name: string } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = todayISO();

  const [
    { data: stages },
    { data: deals },
    { data: projects },
    { data: overdueTasks },
    { count: openTaskCount },
  ] = await Promise.all([
    supabase
      .from("deal_stages")
      .select("id, name, is_won, is_lost")
      .order("sort_order"),
    supabase.from("deals").select("stage_id, value"),
    supabase
      .from("projects")
      .select("id, name, status, due_date, account:accounts(name)")
      .in("status", ["planning", "active", "on_hold"])
      .order("due_date", { nullsFirst: false })
      .limit(6),
    supabase
      .from("tasks")
      .select("id, title, due_date, priority, project:projects(id, name)")
      .neq("status", "done")
      .not("due_date", "is", null)
      .lte("due_date", today)
      .order("due_date")
      .limit(6),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .neq("status", "done"),
  ]);

  const openStages = (stages ?? []).filter(
    (stage) => !stage.is_won && !stage.is_lost
  );
  const openStageIds = new Set(openStages.map((stage) => stage.id));
  const wonStageIds = new Set(
    (stages ?? []).filter((stage) => stage.is_won).map((stage) => stage.id)
  );

  const dealRows = (deals ?? []) as DealRow[];
  const openDeals = dealRows.filter((deal) => openStageIds.has(deal.stage_id));
  const openPipeline = openDeals.reduce(
    (sum, deal) => sum + (deal.value ?? 0),
    0
  );
  const wonTotal = dealRows
    .filter((deal) => wonStageIds.has(deal.stage_id))
    .reduce((sum, deal) => sum + (deal.value ?? 0), 0);

  const pipelineByStage = openStages.map((stage) => {
    const stageDeals = openDeals.filter((deal) => deal.stage_id === stage.id);
    return {
      id: stage.id,
      name: stage.name,
      count: stageDeals.length,
      total: stageDeals.reduce((sum, deal) => sum + (deal.value ?? 0), 0),
    };
  });

  const activeProjects = (projects ?? []) as unknown as ProjectRow[];
  const tasks = (overdueTasks ?? []) as unknown as TaskRow[];

  return (
    <div className="flex flex-col gap-10 px-8 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.1em] text-accent">
          Berenson &amp; Mansfield
        </p>
        <h1 className="mt-2 font-display text-3xl">Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Open pipeline"
          value={currency.format(openPipeline)}
          context={`${openDeals.length} ${openDeals.length === 1 ? "deal" : "deals"} in play`}
          href="/deals"
        />
        <StatTile
          label="Won to date"
          value={currency.format(wonTotal)}
          href="/deals"
        />
        <StatTile
          label="Active projects"
          value={String(activeProjects.length)}
          context={`${openTaskCount ?? 0} open ${openTaskCount === 1 ? "task" : "tasks"}`}
          href="/projects"
        />
        <StatTile
          label="Past due"
          value={String(tasks.length)}
          context={
            tasks.length === 0 ? "Nothing overdue" : "Tasks need attention"
          }
          tone={tasks.length > 0 ? "warn" : "default"}
        />
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl">Open pipeline by stage</h2>
          <Link
            href="/deals"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            View pipeline
          </Link>
        </div>

        {openPipeline === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
            No open deals yet. Add one to start tracking the pipeline.
          </p>
        ) : (
          <PipelineChart stages={pipelineByStage} />
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-5 font-display text-xl">Past due</h2>

          {tasks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
              Nothing overdue. Everything with a due date is on track.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.project && (
                      <Link
                        href={`/projects/${task.project.id}`}
                        className="text-xs text-muted transition-colors hover:text-accent"
                      >
                        {task.project.name}
                      </Link>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <TaskPriorityBadge priority={task.priority} />
                    <span className="text-xs tabular-nums text-warn">
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl">Projects in flight</h2>
            <Link
              href="/projects"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              View all
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
              No active projects. Start one for a client, or for internal work.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {activeProjects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-medium transition-colors hover:text-accent"
                    >
                      {project.name}
                    </Link>
                    <p className="text-xs text-muted">
                      {project.account?.name ?? "Internal"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <ProjectStatusBadge status={project.status} />
                    <span className="text-xs tabular-nums text-muted">
                      {formatDate(project.due_date)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

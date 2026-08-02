import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ProjectStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";

type ProjectRow = {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  account: { id: string; name: string } | null;
  owner: { full_name: string | null; email: string } | null;
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, name, status, due_date, account:accounts(id, name), owner:profiles(full_name, email)"
    )
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as unknown as ProjectRow[];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Delivery work — for a client, or internal."
      />
      <div className="px-8 pb-16">
        <div className="mb-4 flex justify-end">
          <Link
            href="/projects/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            New project
          </Link>
        </div>

        {error && (
          <p className="rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
            Couldn&apos;t load projects: {error.message}
          </p>
        )}

        {!error && projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
            No projects yet. Start one for a client, or for internal work.
          </div>
        )}

        {!error && projects.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Lead</th>
                  <th className="px-5 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-border last:border-0 hover:bg-surface-2"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-medium hover:text-accent"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {project.account ? (
                        <Link
                          href={`/accounts/${project.account.id}`}
                          className="hover:text-accent"
                        >
                          {project.account.name}
                        </Link>
                      ) : (
                        <span className="italic">Internal</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <ProjectStatusBadge status={project.status} />
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {project.owner?.full_name ??
                        project.owner?.email ??
                        "—"}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-muted">
                      {formatDate(project.due_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

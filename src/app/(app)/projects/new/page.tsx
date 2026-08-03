import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "@/components/project-form";
import { createProject } from "../actions";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string; account?: string }>;
}) {
  const { deal, account } = await searchParams;
  const supabase = await createClient();

  const [{ data: accounts }, { data: deals }, { data: contacts }, { data: profiles }] =
    await Promise.all([
      supabase.from("accounts").select("id, name").order("name"),
      supabase.from("deals").select("id, name, account_id").order("name"),
      supabase.from("contacts").select("id, first_name, last_name").order("first_name"),
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name"),
    ]);

  return (
    <>
      <PageHeader
        title="New project"
        description="Start delivery work for a client, or an internal project."
      />
      <div className="max-w-2xl px-8 pb-16">
        <ProjectForm
          project={{ deal_id: deal ?? null, account_id: account ?? null }}
          accounts={accounts ?? []}
          deals={deals ?? []}
          profiles={profiles ?? []}
          contacts={contacts ?? []}
          action={createProject}
          submitLabel="Create project"
        />
      </div>
    </>
  );
}

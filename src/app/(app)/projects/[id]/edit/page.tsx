import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "@/components/project-form";
import { DeleteButton } from "@/components/delete-button";
import { updateProject, deleteProject } from "../../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: accounts }, { data: deals }, { data: contacts }, { data: profiles }] =
    await Promise.all([
      supabase.from("projects").select("*").eq("id", id).single(),
      supabase.from("accounts").select("id, name").order("name"),
      supabase.from("deals").select("id, name, account_id").order("name"),
      supabase.from("contacts").select("id, first_name, last_name").order("first_name"),
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name"),
    ]);

  if (!project) notFound();

  return (
    <>
      <PageHeader title={project.name} description="Edit project details." />
      <div className="max-w-2xl px-8 pb-16">
        <ProjectForm
          project={project}
          accounts={accounts ?? []}
          deals={deals ?? []}
          profiles={profiles ?? []}
          contacts={contacts ?? []}
          action={updateProject}
          submitLabel="Save changes"
        />

        <div className="mt-10 border-t border-border pt-6">
          <form action={deleteProject}>
            <input type="hidden" name="id" value={project.id} />
            <DeleteButton
              confirmText={`Delete ${project.name}? Its milestones and tasks go too. This can't be undone.`}
            />
          </form>
        </div>
      </div>
    </>
  );
}

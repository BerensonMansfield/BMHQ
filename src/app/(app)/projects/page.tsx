import { PageHeader } from "@/components/page-header";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="Delivery work — for a client, or internal."
      />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          Project boards, milestones, and tasks land next, once the Supabase
          project is connected.
        </div>
      </div>
    </>
  );
}

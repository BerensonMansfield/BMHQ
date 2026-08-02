import { PageHeader } from "@/components/page-header";

export default function DealsPage() {
  return (
    <>
      <PageHeader
        title="Deals"
        description="Sales in progress, moving through the pipeline."
      />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          The pipeline board lands next, once the Supabase project is
          connected.
        </div>
      </div>
    </>
  );
}

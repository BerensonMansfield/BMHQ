import { PageHeader } from "@/components/page-header";

export default function AccountsPage() {
  return (
    <>
      <PageHeader
        title="Accounts"
        description="Client companies — prospects and active clients."
      />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          Account list and detail views land next, once the Supabase project
          is connected.
        </div>
      </div>
    </>
  );
}

import { PageHeader } from "@/components/page-header";

export default function ContactsPage() {
  return (
    <>
      <PageHeader
        title="Contacts"
        description="People, tied to an account or standing alone as a lead."
      />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          Contact list and detail views land next, once the Supabase project
          is connected.
        </div>
      </div>
    </>
  );
}

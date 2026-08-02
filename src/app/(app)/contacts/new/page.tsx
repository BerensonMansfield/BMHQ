import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { createContact } from "../actions";

export default async function NewContactPage() {
  const supabase = await createClient();

  const [{ data: accounts }, { data: profiles }] = await Promise.all([
    supabase.from("accounts").select("id, name").order("name"),
    supabase.from("profiles").select("id, full_name, email").order("full_name"),
  ]);

  return (
    <>
      <PageHeader
        title="New contact"
        description="Add a person at a client company, or a standalone lead."
      />
      <div className="mx-auto max-w-2xl px-6 pb-16">
        <ContactForm
          accounts={accounts ?? []}
          profiles={profiles ?? []}
          action={createContact}
          submitLabel="Create contact"
        />
      </div>
    </>
  );
}

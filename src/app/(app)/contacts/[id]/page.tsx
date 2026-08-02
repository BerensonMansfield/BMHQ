import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { DeleteButton } from "@/components/delete-button";
import { updateContact, deleteContact } from "../actions";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: contact }, { data: accounts }, { data: profiles }] =
    await Promise.all([
      supabase.from("contacts").select("*").eq("id", id).single(),
      supabase.from("accounts").select("id, name").order("name"),
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name"),
    ]);

  if (!contact) notFound();

  const name = [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <PageHeader title={name} description="Contact details." />
      <div className="mx-auto max-w-2xl px-6 pb-16">
        <ContactForm
          contact={contact}
          accounts={accounts ?? []}
          profiles={profiles ?? []}
          action={updateContact}
          submitLabel="Save changes"
        />

        <div className="mt-10 border-t border-border pt-6">
          <form action={deleteContact}>
            <input type="hidden" name="id" value={contact.id} />
            <DeleteButton
              confirmText={`Delete ${name}? This can't be undone.`}
            />
          </form>
        </div>
      </div>
    </>
  );
}

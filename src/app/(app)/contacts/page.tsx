import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, email, phone, is_primary, account:accounts(id, name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Contacts"
        description="People, tied to an account or standing alone as a lead."
      />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-4 flex justify-end">
          <Link
            href="/contacts/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            New contact
          </Link>
        </div>

        {error && (
          <p className="rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
            Couldn&apos;t load contacts: {error.message}
          </p>
        )}

        {!error && contacts?.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
            No contacts yet. Add someone from a client company, or a
            standalone lead.
          </div>
        )}

        {!error && contacts && contacts.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Account</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => {
                  const account = contact.account as unknown as {
                    id: string;
                    name: string;
                  } | null;
                  const name = [contact.first_name, contact.last_name]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <tr
                      key={contact.id}
                      className="border-b border-border last:border-0 hover:bg-surface-2"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="font-medium hover:text-accent"
                        >
                          {name}
                        </Link>
                        {contact.is_primary && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                            Primary
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {account ? (
                          <Link
                            href={`/accounts/${account.id}`}
                            className="hover:text-accent"
                          >
                            {account.name}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {contact.email ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {contact.phone ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AccountStatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: accounts, error } = await supabase
    .from("accounts")
    .select("id, name, website, status, owner:profiles(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Accounts"
        description="Client companies — prospects and active clients."
      />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-4 flex justify-end">
          <Link
            href="/accounts/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            New account
          </Link>
        </div>

        {error && (
          <p className="rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
            Couldn&apos;t load accounts: {error.message}
          </p>
        )}

        {!error && accounts?.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
            No accounts yet. Add your first client company to get started.
          </div>
        )}

        {!error && accounts && accounts.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Website</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const owner = account.owner as unknown as {
                    full_name: string | null;
                    email: string;
                  } | null;

                  return (
                    <tr
                      key={account.id}
                      className="border-b border-border last:border-0 hover:bg-surface-2"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/accounts/${account.id}`}
                          className="font-medium hover:text-accent"
                        >
                          {account.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <AccountStatusBadge status={account.status} />
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {owner?.full_name ?? owner?.email ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {account.website ?? "—"}
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

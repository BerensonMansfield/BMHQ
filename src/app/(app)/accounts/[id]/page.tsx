import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { AccountForm } from "@/components/account-form";
import { DeleteButton } from "@/components/delete-button";
import { updateAccount, deleteAccount } from "../actions";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: account }, { data: profiles }] = await Promise.all([
    supabase.from("accounts").select("*").eq("id", id).single(),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .order("full_name"),
  ]);

  if (!account) notFound();

  return (
    <>
      <PageHeader title={account.name} description="Account details." />
      <div className="mx-auto max-w-2xl px-6 pb-16">
        <AccountForm
          account={account}
          profiles={profiles ?? []}
          action={updateAccount}
          submitLabel="Save changes"
        />

        <div className="mt-10 border-t border-border pt-6">
          <form action={deleteAccount}>
            <input type="hidden" name="id" value={account.id} />
            <DeleteButton
              confirmText={`Delete ${account.name}? This can't be undone.`}
            />
          </form>
        </div>
      </div>
    </>
  );
}

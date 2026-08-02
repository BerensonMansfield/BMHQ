import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { AccountForm } from "@/components/account-form";
import { DeleteButton } from "@/components/delete-button";
import { ActivityTimeline } from "@/components/activity-timeline";
import { getActivities } from "@/lib/activities";
import { updateAccount, deleteAccount } from "../actions";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: account }, { data: profiles }, related] = await Promise.all([
    supabase.from("accounts").select("*").eq("id", id).single(),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .order("full_name"),
    // Everything hanging off this client, so its timeline is the whole story.
    Promise.all([
      supabase.from("contacts").select("id").eq("account_id", id),
      supabase.from("deals").select("id").eq("account_id", id),
      supabase.from("projects").select("id").eq("account_id", id),
    ]),
  ]);

  if (!account) notFound();

  const relatedIds = related.flatMap(({ data }) =>
    (data ?? []).map((row) => row.id)
  );
  const activities = await getActivities([id, ...relatedIds]);

  return (
    <>
      <PageHeader title={account.name} description="Account details." />
      <div className="flex max-w-2xl flex-col gap-10 px-8 pb-16">
        <AccountForm
          account={account}
          profiles={profiles ?? []}
          action={updateAccount}
          submitLabel="Save changes"
        />

        <ActivityTimeline
          entityType="account"
          entityId={account.id}
          activities={activities}
          revalidatePath={`/accounts/${account.id}`}
          showSource
          emptyMessage="Nothing logged yet for this client, or anyone and anything tied to it."
        />

        <div className="border-t border-border pt-6">
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

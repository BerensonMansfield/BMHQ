import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DealForm } from "@/components/deal-form";
import { createDeal } from "../actions";

export default async function NewDealPage() {
  const supabase = await createClient();

  const [{ data: accounts }, { data: contacts }, { data: stages }, { data: profiles }] =
    await Promise.all([
      supabase.from("accounts").select("id, name").order("name"),
      supabase
        .from("contacts")
        .select("id, first_name, last_name, account_id")
        .order("first_name"),
      supabase.from("deal_stages").select("id, name").order("sort_order"),
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name"),
    ]);

  return (
    <>
      <PageHeader
        title="New deal"
        description="Track a sale in progress against an account."
      />
      <div className="mx-auto max-w-2xl px-6 pb-16">
        <DealForm
          accounts={accounts ?? []}
          contacts={contacts ?? []}
          stages={stages ?? []}
          profiles={profiles ?? []}
          action={createDeal}
          submitLabel="Create deal"
        />
      </div>
    </>
  );
}

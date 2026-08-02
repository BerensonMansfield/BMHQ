import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DealForm } from "@/components/deal-form";
import { DeleteButton } from "@/components/delete-button";
import { updateDeal, deleteDeal } from "../actions";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: deal },
    { data: accounts },
    { data: contacts },
    { data: stages },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("deals").select("*").eq("id", id).single(),
    supabase.from("accounts").select("id, name").order("name"),
    supabase
      .from("contacts")
      .select("id, first_name, last_name, account_id")
      .order("first_name"),
    supabase.from("deal_stages").select("id, name").order("sort_order"),
    supabase.from("profiles").select("id, full_name, email").order("full_name"),
  ]);

  if (!deal) notFound();

  return (
    <>
      <PageHeader title={deal.name} description="Deal details." />
      <div className="mx-auto max-w-2xl px-6 pb-16">
        <DealForm
          deal={deal}
          accounts={accounts ?? []}
          contacts={contacts ?? []}
          stages={stages ?? []}
          profiles={profiles ?? []}
          action={updateDeal}
          submitLabel="Save changes"
        />

        <div className="mt-10 border-t border-border pt-6">
          <form action={deleteDeal}>
            <input type="hidden" name="id" value={deal.id} />
            <DeleteButton
              confirmText={`Delete ${deal.name}? This can't be undone.`}
            />
          </form>
        </div>
      </div>
    </>
  );
}

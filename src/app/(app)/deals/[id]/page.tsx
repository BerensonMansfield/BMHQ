import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DealForm } from "@/components/deal-form";
import { DeleteButton } from "@/components/delete-button";
import { ActivityTimeline } from "@/components/activity-timeline";
import { getActivities } from "@/lib/activities";
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
    supabase
      .from("deals")
      .select("*, stage:deal_stages(is_won)")
      .eq("id", id)
      .single(),
    supabase.from("accounts").select("id, name").order("name"),
    supabase
      .from("contacts")
      .select("id, first_name, last_name, account_id")
      .order("first_name"),
    supabase.from("deal_stages").select("id, name").order("sort_order"),
    supabase.from("profiles").select("id, full_name, email").order("full_name"),
  ]);

  if (!deal) notFound();

  const isWon = Boolean((deal.stage as { is_won: boolean } | null)?.is_won);

  // A won deal can spawn the delivery project it was sold as — but only once.
  const { data: existingProject } = isWon
    ? await supabase
        .from("projects")
        .select("id, name")
        .eq("deal_id", id)
        .maybeSingle()
    : { data: null };

  const activities = await getActivities([id]);

  return (
    <>
      <PageHeader title={deal.name} description="Deal details." />
      <div className="flex max-w-2xl flex-col gap-10 px-8 pb-16">
        {isWon && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-good/10 px-5 py-4">
            {existingProject ? (
              <>
                <p className="text-sm">
                  Delivered as{" "}
                  <Link
                    href={`/projects/${existingProject.id}`}
                    className="font-medium hover:text-accent"
                  >
                    {existingProject.name}
                  </Link>
                </p>
                <Link
                  href={`/projects/${existingProject.id}`}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  Open project
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm">
                  This deal is won. Ready to start delivery?
                </p>
                <Link
                  href={`/projects/new?deal=${deal.id}&account=${deal.account_id}`}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Convert to project
                </Link>
              </>
            )}
          </div>
        )}

        <DealForm
          deal={deal}
          accounts={accounts ?? []}
          contacts={contacts ?? []}
          stages={stages ?? []}
          profiles={profiles ?? []}
          action={updateDeal}
          submitLabel="Save changes"
        />

        <ActivityTimeline
          entityType="deal"
          entityId={deal.id}
          activities={activities}
          revalidatePath={`/deals/${deal.id}`}
        />

        <div className="border-t border-border pt-6">
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

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { currency, contractValue } from "@/lib/format";

type DealRow = {
  id: string;
  name: string;
  value: number | null;
  revenue_type: string;
  recurring_amount: number | null;
  billing_period: string | null;
  contract_months: number | null;
  expected_close_date: string | null;
  stage_id: string;
  account: { id: string; name: string } | null;
};

const PERIOD_LABEL: Record<string, string> = {
  monthly: "mo",
  quarterly: "qtr",
  annual: "yr",
};

export default async function DealsPage() {
  const supabase = await createClient();

  const [{ data: stages, error: stagesError }, { data: deals, error: dealsError }] =
    await Promise.all([
      supabase
        .from("deal_stages")
        .select("id, name, is_won, is_lost")
        .order("sort_order"),
      supabase
        .from("deals")
        .select(
          "id, name, value, revenue_type, recurring_amount, billing_period, contract_months, expected_close_date, stage_id, account:accounts(id, name)"
        )
        .order("created_at", { ascending: false }),
    ]);

  const error = stagesError ?? dealsError;
  const rows = (deals ?? []) as unknown as DealRow[];

  return (
    <>
      <PageHeader
        title="Deals"
        description="Sales in progress, moving through the pipeline."
      />
      <div className="px-8 pb-16">
        <div className="mb-4 flex justify-end">
          <Link
            href="/deals/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            New deal
          </Link>
        </div>

        {error && (
          <p className="rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
            Couldn&apos;t load the pipeline: {error.message}
          </p>
        )}

        {!error && stages && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4">
              {stages.map((stage) => {
                const stageDeals = rows.filter(
                  (deal) => deal.stage_id === stage.id
                );
                const total = stageDeals.reduce(
                  (sum, deal) => sum + contractValue(deal),
                  0
                );

                return (
                  <section
                    key={stage.id}
                    className="flex w-64 shrink-0 flex-col gap-3"
                  >
                    <header className="flex items-baseline justify-between border-b border-border pb-2">
                      <h2 className="text-sm font-medium">
                        {stage.name}
                        {stage.is_won && (
                          <span className="ml-1.5 text-good">✓</span>
                        )}
                      </h2>
                      <span className="text-xs tabular-nums text-muted">
                        {stageDeals.length}
                        {total > 0 && ` · ${currency.format(total)}`}
                      </span>
                    </header>

                    <div className="flex flex-col gap-2">
                      {stageDeals.length === 0 && (
                        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted">
                          Empty
                        </p>
                      )}

                      {stageDeals.map((deal) => (
                        <Link
                          key={deal.id}
                          href={`/deals/${deal.id}`}
                          className="rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent"
                        >
                          <p className="text-sm font-medium">{deal.name}</p>
                          <p className="mt-1 text-xs text-muted">
                            {deal.account?.name ?? "No account"}
                          </p>
                          {deal.revenue_type === "retainer" ? (
                            deal.recurring_amount !== null && (
                              <p className="mt-2 text-sm tabular-nums text-accent">
                                {currency.format(deal.recurring_amount)}
                                <span className="text-muted">
                                  /{PERIOD_LABEL[deal.billing_period ?? "monthly"]}
                                </span>
                                {deal.contract_months && (
                                  <span className="text-muted">
                                    {" · "}
                                    {deal.contract_months} mo
                                  </span>
                                )}
                              </p>
                            )
                          ) : (
                            deal.value !== null && (
                              <p className="mt-2 text-sm tabular-nums text-accent">
                                {currency.format(deal.value)}
                              </p>
                            )
                          )}
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

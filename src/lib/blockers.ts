import { createClient } from "@/lib/supabase/server";

export type Blocker = {
  id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string | null;
  severity: string;
  is_client_side: boolean;
  raised_at: string;
  resolved_at: string | null;
  resolution: string | null;
  owner: { full_name: string | null; email: string } | null;
};

// blockers points at profiles twice (owner_id, raised_by), so the embed has to
// name which foreign key it means.
const SELECT =
  "id, entity_type, entity_id, title, description, severity, is_client_side, raised_at, resolved_at, resolution, owner:profiles!blockers_owner_id_fkey(full_name, email)";

export async function getBlockers(entityIds: string[]) {
  const ids = entityIds.filter(Boolean);
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("blockers")
    .select(SELECT)
    // Unresolved first, then most recently raised.
    .in("entity_id", ids)
    .order("resolved_at", { nullsFirst: true })
    .order("raised_at", { ascending: false });

  return (data ?? []) as unknown as Blocker[];
}

export function daysBlocked(raisedAt: string, resolvedAt: string | null) {
  const end = resolvedAt ? new Date(resolvedAt) : new Date();
  const days = Math.floor(
    (end.getTime() - new Date(raisedAt).getTime()) / 86_400_000
  );
  return Math.max(days, 0);
}

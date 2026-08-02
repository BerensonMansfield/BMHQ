import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/components/activity-timeline";

const SELECT =
  "id, entity_type, entity_id, type, subject, body, occurred_at, author:profiles(full_name, email)";

/**
 * Entity ids are uuids, so they identify a row on their own — passing several
 * lets an account pull in the log from its contacts, deals, and projects
 * without a query per table.
 */
export async function getActivities(entityIds: string[]) {
  const ids = entityIds.filter(Boolean);
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("activities")
    .select(SELECT)
    .in("entity_id", ids)
    .order("occurred_at", { ascending: false })
    .limit(50);

  return (data ?? []) as unknown as Activity[];
}

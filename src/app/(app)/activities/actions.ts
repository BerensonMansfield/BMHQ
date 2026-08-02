"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function valueOrNull(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

/**
 * The log is polymorphic, so the caller tells us which page to refresh —
 * there's no single route that owns an activity.
 */
function revalidateCaller(formData: FormData) {
  const path = formData.get("revalidate_path");
  if (typeof path === "string" && path.startsWith("/")) {
    revalidatePath(path, "layout");
  }
}

export async function createActivity(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const occurredAt = valueOrNull(formData, "occurred_at");

  const { error } = await supabase.from("activities").insert({
    entity_type: formData.get("entity_type") as string,
    entity_id: formData.get("entity_id") as string,
    type: formData.get("type") as string,
    subject: valueOrNull(formData, "subject"),
    body: valueOrNull(formData, "body"),
    author_id: user?.id ?? null,
    // A datetime-local value carries no zone; treat it as the browser's.
    occurred_at: occurredAt
      ? new Date(occurredAt).toISOString()
      : new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidateCaller(formData);
}

export async function deleteActivity(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", formData.get("id") as string);

  if (error) throw new Error(error.message);
  revalidateCaller(formData);
}

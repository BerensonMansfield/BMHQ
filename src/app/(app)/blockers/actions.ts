"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function valueOrNull(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

/** Blockers are polymorphic, so the caller names the page to refresh. */
function revalidateCaller(formData: FormData) {
  const path = formData.get("revalidate_path");
  if (typeof path === "string" && path.startsWith("/")) {
    revalidatePath(path, "layout");
  }
}

export async function raiseBlocker(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("blockers").insert({
    entity_type: formData.get("entity_type") as string,
    entity_id: formData.get("entity_id") as string,
    title: (formData.get("title") as string).trim(),
    description: valueOrNull(formData, "description"),
    severity: (formData.get("severity") as string) ?? "medium",
    is_client_side: formData.get("is_client_side") === "on",
    owner_id: valueOrNull(formData, "owner_id"),
    raised_by: user?.id ?? null,
  });

  if (error) throw new Error(error.message);
  revalidateCaller(formData);
}

export async function resolveBlocker(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("blockers")
    .update({
      resolved_at: new Date().toISOString(),
      resolution: valueOrNull(formData, "resolution"),
    })
    .eq("id", formData.get("id") as string);

  if (error) throw new Error(error.message);
  revalidateCaller(formData);
}

/** Puts a resolved blocker back in play — it wasn't actually fixed. */
export async function reopenBlocker(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("blockers")
    .update({ resolved_at: null, resolution: null })
    .eq("id", formData.get("id") as string);

  if (error) throw new Error(error.message);
  revalidateCaller(formData);
}

export async function deleteBlocker(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("blockers")
    .delete()
    .eq("id", formData.get("id") as string);

  if (error) throw new Error(error.message);
  revalidateCaller(formData);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function valueOrNull(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

function numberOrNull(formData: FormData, key: string) {
  const value = valueOrNull(formData, key);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// A deal is closed the moment it lands in a won or lost stage, and reopens
// if it's moved back out of one.
async function closedAtForStage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  stageId: string,
  existingClosedAt: string | null
) {
  const { data: stage } = await supabase
    .from("deal_stages")
    .select("is_won, is_lost")
    .eq("id", stageId)
    .single();

  const isClosed = Boolean(stage?.is_won || stage?.is_lost);
  if (!isClosed) return null;
  return existingClosedAt ?? new Date().toISOString();
}

export async function createDeal(formData: FormData) {
  const supabase = await createClient();
  const stageId = formData.get("stage_id") as string;

  const { data, error } = await supabase
    .from("deals")
    .insert({
      account_id: formData.get("account_id") as string,
      primary_contact_id: valueOrNull(formData, "primary_contact_id"),
      name: (formData.get("name") as string).trim(),
      stage_id: stageId,
      value: numberOrNull(formData, "value"),
      expected_close_date: valueOrNull(formData, "expected_close_date"),
      closed_at: await closedAtForStage(supabase, stageId, null),
      source: valueOrNull(formData, "source"),
      notes: valueOrNull(formData, "notes"),
      owner_id: valueOrNull(formData, "owner_id"),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/deals");
  redirect(`/deals/${data.id}`);
}

export async function updateDeal(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const stageId = formData.get("stage_id") as string;

  const { data: existing } = await supabase
    .from("deals")
    .select("closed_at")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("deals")
    .update({
      account_id: formData.get("account_id") as string,
      primary_contact_id: valueOrNull(formData, "primary_contact_id"),
      name: (formData.get("name") as string).trim(),
      stage_id: stageId,
      value: numberOrNull(formData, "value"),
      expected_close_date: valueOrNull(formData, "expected_close_date"),
      closed_at: await closedAtForStage(
        supabase,
        stageId,
        existing?.closed_at ?? null
      ),
      source: valueOrNull(formData, "source"),
      notes: valueOrNull(formData, "notes"),
      owner_id: valueOrNull(formData, "owner_id"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/deals");
  revalidatePath(`/deals/${id}`);
  redirect(`/deals/${id}`);
}

export async function deleteDeal(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("deals").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/deals");
  redirect("/deals");
}

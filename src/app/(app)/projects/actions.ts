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

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      // Blank account means internal work rather than client delivery.
      account_id: valueOrNull(formData, "account_id"),
      deal_id: valueOrNull(formData, "deal_id"),
      name: (formData.get("name") as string).trim(),
      description: valueOrNull(formData, "description"),
      status: formData.get("status") as string,
      start_date: valueOrNull(formData, "start_date"),
      due_date: valueOrNull(formData, "due_date"),
      budget: numberOrNull(formData, "budget"),
      owner_id: valueOrNull(formData, "owner_id"),
      health: formData.get("health") as string,
      service_line: valueOrNull(formData, "service_line"),
      billing_type: valueOrNull(formData, "billing_type"),
      estimated_hours: numberOrNull(formData, "estimated_hours"),
      client_contact_id: valueOrNull(formData, "client_contact_id"),
      internal_notes: valueOrNull(formData, "internal_notes"),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  redirect(`/projects/${data.id}`);
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("projects")
    .update({
      account_id: valueOrNull(formData, "account_id"),
      deal_id: valueOrNull(formData, "deal_id"),
      name: (formData.get("name") as string).trim(),
      description: valueOrNull(formData, "description"),
      status: formData.get("status") as string,
      start_date: valueOrNull(formData, "start_date"),
      due_date: valueOrNull(formData, "due_date"),
      budget: numberOrNull(formData, "budget"),
      owner_id: valueOrNull(formData, "owner_id"),
      health: formData.get("health") as string,
      service_line: valueOrNull(formData, "service_line"),
      billing_type: valueOrNull(formData, "billing_type"),
      estimated_hours: numberOrNull(formData, "estimated_hours"),
      client_contact_id: valueOrNull(formData, "client_contact_id"),
      internal_notes: valueOrNull(formData, "internal_notes"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  redirect("/projects");
}

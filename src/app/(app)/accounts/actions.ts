"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function valueOrNull(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

export async function createAccount(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      name: (formData.get("name") as string).trim(),
      website: valueOrNull(formData, "website"),
      industry: valueOrNull(formData, "industry"),
      phone: valueOrNull(formData, "phone"),
      address: valueOrNull(formData, "address"),
      status: formData.get("status") as string,
      description: valueOrNull(formData, "description"),
      owner_id: valueOrNull(formData, "owner_id"),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/accounts");
  redirect(`/accounts/${data.id}`);
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("accounts")
    .update({
      name: (formData.get("name") as string).trim(),
      website: valueOrNull(formData, "website"),
      industry: valueOrNull(formData, "industry"),
      phone: valueOrNull(formData, "phone"),
      address: valueOrNull(formData, "address"),
      status: formData.get("status") as string,
      description: valueOrNull(formData, "description"),
      owner_id: valueOrNull(formData, "owner_id"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/accounts");
  revalidatePath(`/accounts/${id}`);
  redirect(`/accounts/${id}`);
}

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/accounts");
  redirect("/accounts");
}

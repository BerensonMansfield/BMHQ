"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function valueOrNull(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

export async function createContact(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      account_id: valueOrNull(formData, "account_id"),
      first_name: (formData.get("first_name") as string).trim(),
      last_name: valueOrNull(formData, "last_name"),
      email: valueOrNull(formData, "email"),
      phone: valueOrNull(formData, "phone"),
      title: valueOrNull(formData, "title"),
      is_primary: formData.get("is_primary") === "on",
      notes: valueOrNull(formData, "notes"),
      owner_id: valueOrNull(formData, "owner_id"),
      buying_role: valueOrNull(formData, "buying_role"),
      mobile_phone: valueOrNull(formData, "mobile_phone"),
      linkedin_url: valueOrNull(formData, "linkedin_url"),
      preferred_contact_method: valueOrNull(
        formData,
        "preferred_contact_method"
      ),
      do_not_contact: formData.get("do_not_contact") === "on",
      timezone: valueOrNull(formData, "timezone"),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/contacts");
  redirect(`/contacts/${data.id}`);
}

export async function updateContact(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("contacts")
    .update({
      account_id: valueOrNull(formData, "account_id"),
      first_name: (formData.get("first_name") as string).trim(),
      last_name: valueOrNull(formData, "last_name"),
      email: valueOrNull(formData, "email"),
      phone: valueOrNull(formData, "phone"),
      title: valueOrNull(formData, "title"),
      is_primary: formData.get("is_primary") === "on",
      notes: valueOrNull(formData, "notes"),
      owner_id: valueOrNull(formData, "owner_id"),
      buying_role: valueOrNull(formData, "buying_role"),
      mobile_phone: valueOrNull(formData, "mobile_phone"),
      linkedin_url: valueOrNull(formData, "linkedin_url"),
      preferred_contact_method: valueOrNull(
        formData,
        "preferred_contact_method"
      ),
      do_not_contact: formData.get("do_not_contact") === "on",
      timezone: valueOrNull(formData, "timezone"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
  redirect(`/contacts/${id}`);
}

export async function deleteContact(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/contacts");
  redirect("/contacts");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function valueOrNull(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

// Milestones

export async function createMilestone(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;

  const { error } = await supabase.from("milestones").insert({
    project_id: projectId,
    name: (formData.get("name") as string).trim(),
    due_date: valueOrNull(formData, "due_date"),
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");
}

export async function setMilestoneStatus(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("milestones")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");
}

export async function updateMilestone(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("milestones")
    .update({
      name: (formData.get("name") as string).trim(),
      description: valueOrNull(formData, "description"),
      due_date: valueOrNull(formData, "due_date"),
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");
}

export async function deleteMilestone(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;

  const { error } = await supabase
    .from("milestones")
    .delete()
    .eq("id", formData.get("id") as string);

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");

  // Deleting from the milestone's own page leaves nowhere to stand.
  if (formData.get("return_to_project")) {
    redirect(`/projects/${projectId}`);
  }
}

// Tasks

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    milestone_id: valueOrNull(formData, "milestone_id"),
    title: (formData.get("title") as string).trim(),
    priority: (formData.get("priority") as string) ?? "medium",
    assignee_id: valueOrNull(formData, "assignee_id"),
    due_date: valueOrNull(formData, "due_date"),
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");
}

export async function setTaskStatus(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", formData.get("id") as string);

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");
}

export async function deleteTask(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", formData.get("id") as string);

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");
}

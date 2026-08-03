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
      owner_id: valueOrNull(formData, "owner_id"),
      is_client_facing: formData.get("is_client_facing") === "on",
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    milestone_id: valueOrNull(formData, "milestone_id"),
    // Set when adding from a task's own page — makes this a subtask.
    parent_task_id: valueOrNull(formData, "parent_task_id"),
    title: (formData.get("title") as string).trim(),
    priority: (formData.get("priority") as string) ?? "medium",
    assignee_id: valueOrNull(formData, "assignee_id"),
    due_date: valueOrNull(formData, "due_date"),
    created_by: user?.id ?? null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`, "layout");
}

export async function updateTask(formData: FormData) {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("tasks")
    .update({
      title: (formData.get("title") as string).trim(),
      description: valueOrNull(formData, "description"),
      status,
      priority: formData.get("priority") as string,
      milestone_id: valueOrNull(formData, "milestone_id"),
      assignee_id: valueOrNull(formData, "assignee_id"),
      start_date: valueOrNull(formData, "start_date"),
      due_date: valueOrNull(formData, "due_date"),
      estimated_hours: numberOrNull(formData, "estimated_hours"),
      actual_hours: numberOrNull(formData, "actual_hours"),
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", formData.get("id") as string);

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

  // Deleting from the task's own page leaves nowhere to stand.
  if (formData.get("return_to_project")) {
    redirect(`/projects/${projectId}`);
  }
}

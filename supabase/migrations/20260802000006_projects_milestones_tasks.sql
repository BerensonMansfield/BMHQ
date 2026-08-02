-- projects: a body of work — for a client, or internal when account_id is null.
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts (id) on delete set null,
  deal_id uuid references public.deals (id) on delete set null,
  name text not null,
  description text,
  status text not null default 'planning'
    check (status in ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  start_date date,
  due_date date,
  budget numeric(12, 2),
  owner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.projects.account_id is
  'Nullable — a project with no account is internal work (tooling, our own site, ops) rather than client delivery.';

create index projects_account_id_idx on public.projects (account_id);
create index projects_deal_id_idx on public.projects (deal_id);
create index projects_owner_id_idx on public.projects (owner_id);
create index projects_status_idx on public.projects (status);

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "authenticated team members have full access to projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- milestones: checkpoints within a project.
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  description text,
  due_date date,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  sort_order int,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index milestones_project_id_idx on public.milestones (project_id);

create trigger set_milestones_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();

alter table public.milestones enable row level security;

create policy "authenticated team members have full access to milestones"
  on public.milestones for all
  to authenticated
  using (true)
  with check (true);

-- tasks: the unit of work — optionally grouped under a milestone, optionally a subtask.
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  milestone_id uuid references public.milestones (id) on delete set null,
  parent_task_id uuid references public.tasks (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'in_review', 'done')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.profiles (id) on delete set null,
  due_date date,
  sort_order int,
  created_by uuid references public.profiles (id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_project_id_idx on public.tasks (project_id);
create index tasks_milestone_id_idx on public.tasks (milestone_id);
create index tasks_parent_task_id_idx on public.tasks (parent_task_id);
create index tasks_assignee_id_idx on public.tasks (assignee_id);
create index tasks_status_idx on public.tasks (status);

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

alter table public.tasks enable row level security;

create policy "authenticated team members have full access to tasks"
  on public.tasks for all
  to authenticated
  using (true)
  with check (true);

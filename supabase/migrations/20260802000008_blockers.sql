-- blockers: what's stopping work, on a task, milestone, or whole project.
--
-- A table rather than an is_blocked flag, because one record can be stuck on
-- several things at once, the history matters after it clears, and "what is
-- blocked right now across every project" should be a single query.
-- "Blocked" is derived: a record is blocked when it has a blocker whose
-- resolved_at is null, so there is no flag to keep in sync.
create table public.blockers (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('task', 'milestone', 'project')),
  entity_id uuid not null,
  title text not null,
  description text,
  severity text not null default 'medium'
    check (severity in ('low', 'medium', 'high', 'critical')),
  is_client_side boolean not null default false,
  owner_id uuid references public.profiles (id) on delete set null,
  raised_by uuid references public.profiles (id) on delete set null,
  raised_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.blockers.entity_id is
  'Polymorphic — points into whichever table entity_type names. Enforced in application code, same pattern as activities.';
comment on column public.blockers.is_client_side is
  'Waiting on the client vs. waiting on us — the split that matters when a deadline slips.';

create index blockers_entity_idx on public.blockers (entity_type, entity_id);
create index blockers_owner_id_idx on public.blockers (owner_id);
-- Partial index: the common query is "still blocking".
create index blockers_unresolved_idx on public.blockers (entity_id)
  where resolved_at is null;

create trigger set_blockers_updated_at
  before update on public.blockers
  for each row execute function public.set_updated_at();

alter table public.blockers enable row level security;

create policy "authenticated team members have full access to blockers"
  on public.blockers for all
  to authenticated
  using (true)
  with check (true);

-- activities: notes, calls, emails, meetings — logged against any entity.
-- entity_id is a polymorphic reference (points into whichever table entity_type
-- names) and is intentionally not a foreign key; enforced in application code.
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('account', 'contact', 'deal', 'project', 'task')),
  entity_id uuid not null,
  type text not null default 'note'
    check (type in ('note', 'call', 'email', 'meeting', 'status_change')),
  subject text,
  body text,
  author_id uuid references public.profiles (id) on delete set null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index activities_entity_idx on public.activities (entity_type, entity_id);
create index activities_author_id_idx on public.activities (author_id);
create index activities_occurred_at_idx on public.activities (occurred_at desc);

alter table public.activities enable row level security;

create policy "authenticated team members have full access to activities"
  on public.activities for all
  to authenticated
  using (true)
  with check (true);

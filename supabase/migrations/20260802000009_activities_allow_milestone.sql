-- Milestones gained their own page in v0.2, so they can carry a log too.
alter table public.activities
  drop constraint activities_entity_type_check;

alter table public.activities
  add constraint activities_entity_type_check
  check (entity_type in ('account', 'contact', 'deal', 'project', 'task', 'milestone'));

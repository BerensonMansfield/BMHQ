-- Extensions
create extension if not exists pgcrypto;

-- Shared trigger function: keeps `updated_at` current on every UPDATE.
-- Attached per-table in later migrations.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

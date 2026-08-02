-- profiles: one row per team member, extends auth.users.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  title text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Team members. role is a single ''admin'' value for the pilot — every login has full access; per-role permissions can be layered on later without a schema change.';

-- Auto-create a profile row whenever someone signs up through Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "profiles are visible to any team member"
  on public.profiles for select
  to authenticated
  using (true);

create policy "a team member can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

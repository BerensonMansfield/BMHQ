-- accounts: client companies (prospects and clients, past or active).
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text,
  logo_url text,
  phone text,
  address text,
  status text not null default 'prospect'
    check (status in ('prospect', 'active_client', 'past_client')),
  description text,
  owner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index accounts_owner_id_idx on public.accounts (owner_id);
create index accounts_status_idx on public.accounts (status);

create trigger set_accounts_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

alter table public.accounts enable row level security;

create policy "authenticated team members have full access to accounts"
  on public.accounts for all
  to authenticated
  using (true)
  with check (true);

-- contacts: people, usually at an account, sometimes a standalone lead.
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts (id) on delete set null,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  title text,
  is_primary boolean not null default false,
  notes text,
  owner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_account_id_idx on public.contacts (account_id);
create index contacts_owner_id_idx on public.contacts (owner_id);

create trigger set_contacts_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

alter table public.contacts enable row level security;

create policy "authenticated team members have full access to contacts"
  on public.contacts for all
  to authenticated
  using (true)
  with check (true);

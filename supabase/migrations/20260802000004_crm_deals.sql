-- deal_stages: configurable pipeline — editable from the app, no migration needed to reorder or rename.
create table public.deal_stages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null,
  win_probability int check (win_probability between 0 and 100),
  is_won boolean not null default false,
  is_lost boolean not null default false
);

alter table public.deal_stages enable row level security;

create policy "authenticated team members have full access to deal_stages"
  on public.deal_stages for all
  to authenticated
  using (true)
  with check (true);

insert into public.deal_stages (name, sort_order, win_probability, is_won, is_lost) values
  ('Lead',             1, 10,  false, false),
  ('Qualified',        2, 25,  false, false),
  ('Proposal Sent',    3, 50,  false, false),
  ('Negotiation',      4, 75,  false, false),
  ('Won',              5, 100, true,  false),
  ('Lost',             6, 0,   false, true);

-- deals: a sale in progress against an account.
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  primary_contact_id uuid references public.contacts (id) on delete set null,
  name text not null,
  stage_id uuid not null references public.deal_stages (id),
  value numeric(12, 2),
  currency text not null default 'USD',
  expected_close_date date,
  closed_at timestamptz,
  source text,
  notes text,
  owner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index deals_account_id_idx on public.deals (account_id);
create index deals_stage_id_idx on public.deals (stage_id);
create index deals_owner_id_idx on public.deals (owner_id);

create trigger set_deals_updated_at
  before update on public.deals
  for each row execute function public.set_updated_at();

alter table public.deals enable row level security;

create policy "authenticated team members have full access to deals"
  on public.deals for all
  to authenticated
  using (true)
  with check (true);

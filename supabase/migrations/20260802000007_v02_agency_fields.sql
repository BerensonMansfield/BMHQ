-- v0.2 — agency fields. Additive only: nothing renamed, nothing dropped.

-- accounts. Relationship health lives on projects instead, by decision:
-- delivery health is the one the team would actually keep current.
alter table public.accounts
  add column source text,
  add column company_size text,
  add column linkedin_url text,
  add column billing_email text,
  add column renewal_date date,
  add column timezone text;

comment on column public.accounts.renewal_date is
  'Retainer renewal date — drives an upcoming-renewals view.';

-- contacts
alter table public.contacts
  add column buying_role text
    check (buying_role in ('decision_maker', 'champion', 'influencer', 'gatekeeper', 'end_user')),
  add column mobile_phone text,
  add column linkedin_url text,
  add column preferred_contact_method text
    check (preferred_contact_method in ('email', 'phone', 'text', 'slack')),
  add column do_not_contact boolean not null default false,
  add column timezone text;

-- deals. revenue_type defaults to one_time so existing rows keep their meaning.
alter table public.deals
  add column revenue_type text not null default 'one_time'
    check (revenue_type in ('one_time', 'retainer')),
  add column recurring_amount numeric(12, 2),
  add column billing_period text
    check (billing_period in ('monthly', 'quarterly', 'annual')),
  add column contract_months int check (contract_months > 0),
  add column service_line text,
  add column probability int check (probability between 0 and 100),
  add column next_step text,
  add column lost_reason text,
  add column competitor text;

comment on column public.deals.revenue_type is
  'one_time deals carry `value`; retainers carry recurring_amount x billing_period, optionally over contract_months.';

create index deals_revenue_type_idx on public.deals (revenue_type);

-- projects. health is deliberately separate from status: an active project
-- can be off track, and that pair is what a dashboard needs.
alter table public.projects
  add column health text not null default 'on_track'
    check (health in ('on_track', 'at_risk', 'off_track')),
  add column service_line text,
  add column billing_type text
    check (billing_type in ('fixed_fee', 'hourly', 'retainer')),
  add column estimated_hours numeric(8, 2),
  add column client_contact_id uuid references public.contacts (id) on delete set null,
  add column internal_notes text;

create index projects_health_idx on public.projects (health);

-- milestones
alter table public.milestones
  add column owner_id uuid references public.profiles (id) on delete set null,
  add column is_client_facing boolean not null default false;

-- tasks
alter table public.tasks
  add column start_date date,
  add column estimated_hours numeric(6, 2),
  add column actual_hours numeric(6, 2);

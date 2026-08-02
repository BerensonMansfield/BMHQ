# BMHQ

Berenson & Mansfield's internal CRM + project management platform. Accounts,
contacts, and deals on the sales side; projects, milestones, and tasks on the
delivery side — one activity log spanning both.

Pilot v0.1. Stack: Next.js (App Router, TypeScript) + Tailwind CSS + Supabase.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a Supabase project, then copy `.env.example` to `.env.local` and
   fill in the values from Project Settings → API:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

3. Push the schema. With the [Supabase CLI](https://supabase.com/docs/guides/cli)
   linked to your project:

   ```
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

   This runs everything in `supabase/migrations/` — profiles, accounts,
   contacts, deal_stages, deals, activities, projects, milestones, and tasks,
   with row-level security enabled on every table.

4. Regenerate typed database bindings (replaces the placeholder at
   `src/lib/supabase/types.ts`):

   ```
   npx supabase gen types typescript --linked > src/lib/supabase/types.ts
   ```

5. Run the dev server:

   ```
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Schema

See `supabase/migrations/` for the source of truth. Summary:

- **profiles** — team members, extends `auth.users`. Single `admin` role for
  the pilot; every login has full read/write access.
- **accounts / contacts / deal_stages / deals** — the CRM side.
- **activities** — a single log (notes, calls, emails, meetings) that can
  attach to an account, contact, deal, project, or task.
- **projects / milestones / tasks** — the delivery side. A project's
  `account_id` is nullable — blank means internal work rather than client
  delivery. `projects.deal_id` links back to the deal it was won from.

Attachments and tags are deferred to v2.

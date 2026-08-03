type Profile = { id: string; full_name: string | null; email: string };
type AccountOption = { id: string; name: string };
type DealOption = { id: string; name: string; account_id: string };
type ContactOption = {
  id: string;
  first_name: string;
  last_name: string | null;
};

type Project = {
  id?: string;
  account_id?: string | null;
  deal_id?: string | null;
  name?: string;
  description?: string | null;
  status?: string;
  start_date?: string | null;
  due_date?: string | null;
  budget?: number | null;
  owner_id?: string | null;
  health?: string;
  service_line?: string | null;
  billing_type?: string | null;
  estimated_hours?: number | null;
  client_contact_id?: string | null;
  internal_notes?: string | null;
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent";

export function ProjectForm({
  project,
  accounts,
  deals,
  profiles,
  contacts = [],
  action,
  submitLabel,
}: {
  project?: Project;
  accounts: AccountOption[];
  deals: DealOption[];
  profiles: Profile[];
  contacts?: ContactOption[];
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {project?.id && <input type="hidden" name="id" value={project.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Project name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={project?.name}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="account_id" className="text-sm font-medium">
            Account
          </label>
          <select
            id="account_id"
            name="account_id"
            defaultValue={project?.account_id ?? ""}
            className={inputClass}
          >
            <option value="">Internal project</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted">
            Leave as internal for our own work — tooling, the site, ops.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="deal_id" className="text-sm font-medium">
            Won from deal
          </label>
          <select
            id="deal_id"
            name="deal_id"
            defaultValue={project?.deal_id ?? ""}
            className={inputClass}
          >
            <option value="">Not tied to a deal</option>
            {deals.map((deal) => (
              <option key={deal.id} value={deal.id}>
                {deal.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "planning"}
            className={inputClass}
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="owner_id" className="text-sm font-medium">
            Project lead
          </label>
          <select
            id="owner_id"
            name="owner_id"
            defaultValue={project?.owner_id ?? ""}
            className={inputClass}
          >
            <option value="">Unassigned</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name ?? profile.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="start_date" className="text-sm font-medium">
            Start date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={project?.start_date ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="due_date" className="text-sm font-medium">
            Due date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={project?.due_date ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="health" className="text-sm font-medium">
            Health
          </label>
          <select
            id="health"
            name="health"
            defaultValue={project?.health ?? "on_track"}
            className={inputClass}
          >
            <option value="on_track">On track</option>
            <option value="at_risk">At risk</option>
            <option value="off_track">Off track</option>
          </select>
          <p className="text-xs text-muted">
            Separate from status — an active project can still be off track.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="client_contact_id" className="text-sm font-medium">
            Client contact
          </label>
          <select
            id="client_contact_id"
            name="client_contact_id"
            defaultValue={project?.client_contact_id ?? ""}
            className={inputClass}
          >
            <option value="">None</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {[contact.first_name, contact.last_name]
                  .filter(Boolean)
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="service_line" className="text-sm font-medium">
            Service line
          </label>
          <input
            id="service_line"
            name="service_line"
            placeholder="Marketing automation, CRM implementation…"
            defaultValue={project?.service_line ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="billing_type" className="text-sm font-medium">
            Billing
          </label>
          <select
            id="billing_type"
            name="billing_type"
            defaultValue={project?.billing_type ?? ""}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="fixed_fee">Fixed fee</option>
            <option value="hourly">Hourly</option>
            <option value="retainer">Retainer</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="budget" className="text-sm font-medium">
            Budget (USD)
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            step="0.01"
            min="0"
            defaultValue={project?.budget ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="estimated_hours" className="text-sm font-medium">
            Estimated hours
          </label>
          <input
            id="estimated_hours"
            name="estimated_hours"
            type="number"
            step="0.25"
            min="0"
            placeholder="Optional"
            defaultValue={project?.estimated_hours ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="internal_notes" className="text-sm font-medium">
          Internal notes
        </label>
        <textarea
          id="internal_notes"
          name="internal_notes"
          rows={3}
          placeholder="Kept apart from the description — somewhere frank."
          defaultValue={project?.internal_notes ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

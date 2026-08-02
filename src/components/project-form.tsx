type Profile = { id: string; full_name: string | null; email: string };
type AccountOption = { id: string; name: string };
type DealOption = { id: string; name: string; account_id: string };

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
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent";

export function ProjectForm({
  project,
  accounts,
  deals,
  profiles,
  action,
  submitLabel,
}: {
  project?: Project;
  accounts: AccountOption[];
  deals: DealOption[];
  profiles: Profile[];
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

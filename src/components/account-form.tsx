type Profile = { id: string; full_name: string | null; email: string };

type Account = {
  id?: string;
  name?: string;
  website?: string | null;
  industry?: string | null;
  phone?: string | null;
  address?: string | null;
  status?: string;
  description?: string | null;
  owner_id?: string | null;
  source?: string | null;
  company_size?: string | null;
  linkedin_url?: string | null;
  billing_email?: string | null;
  renewal_date?: string | null;
  timezone?: string | null;
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent";

export function AccountForm({
  account,
  profiles,
  action,
  submitLabel,
}: {
  account?: Account;
  profiles: Profile[];
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {account?.id && <input type="hidden" name="id" value={account.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={account?.name}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={account?.status ?? "prospect"}
            className={inputClass}
          >
            <option value="prospect">Prospect</option>
            <option value="active_client">Active client</option>
            <option value="past_client">Past client</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="owner_id" className="text-sm font-medium">
            Owner
          </label>
          <select
            id="owner_id"
            name="owner_id"
            defaultValue={account?.owner_id ?? ""}
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
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <input
            id="website"
            name="website"
            placeholder="https://"
            defaultValue={account?.website ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="industry" className="text-sm font-medium">
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            defaultValue={account?.industry ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={account?.phone ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={account?.address ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="source" className="text-sm font-medium">
            Source
          </label>
          <input
            id="source"
            name="source"
            placeholder="Referral, inbound, event…"
            defaultValue={account?.source ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company_size" className="text-sm font-medium">
            Company size
          </label>
          <input
            id="company_size"
            name="company_size"
            placeholder="1–10, 11–50, 51–200…"
            defaultValue={account?.company_size ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="linkedin_url" className="text-sm font-medium">
            LinkedIn
          </label>
          <input
            id="linkedin_url"
            name="linkedin_url"
            defaultValue={account?.linkedin_url ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="billing_email" className="text-sm font-medium">
            Billing email
          </label>
          <input
            id="billing_email"
            name="billing_email"
            type="email"
            placeholder="Where invoices go"
            defaultValue={account?.billing_email ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="renewal_date" className="text-sm font-medium">
            Renewal date
          </label>
          <input
            id="renewal_date"
            name="renewal_date"
            type="date"
            defaultValue={account?.renewal_date ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="timezone" className="text-sm font-medium">
            Timezone
          </label>
          <input
            id="timezone"
            name="timezone"
            placeholder="ET, PT, GMT…"
            defaultValue={account?.timezone ?? ""}
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
          defaultValue={account?.description ?? ""}
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

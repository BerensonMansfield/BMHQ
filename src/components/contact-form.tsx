type Profile = { id: string; full_name: string | null; email: string };
type AccountOption = { id: string; name: string };

type Contact = {
  id?: string;
  account_id?: string | null;
  first_name?: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  is_primary?: boolean;
  notes?: string | null;
  owner_id?: string | null;
  buying_role?: string | null;
  mobile_phone?: string | null;
  linkedin_url?: string | null;
  preferred_contact_method?: string | null;
  do_not_contact?: boolean;
  timezone?: string | null;
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent";

export function ContactForm({
  contact,
  accounts,
  profiles,
  action,
  submitLabel,
}: {
  contact?: Contact;
  accounts: AccountOption[];
  profiles: Profile[];
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {contact?.id && <input type="hidden" name="id" value={contact.id} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="first_name" className="text-sm font-medium">
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            required
            defaultValue={contact?.first_name}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="last_name" className="text-sm font-medium">
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            defaultValue={contact?.last_name ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="account_id" className="text-sm font-medium">
            Account
          </label>
          <select
            id="account_id"
            name="account_id"
            defaultValue={contact?.account_id ?? ""}
            className={inputClass}
          >
            <option value="">No account (standalone lead)</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="owner_id" className="text-sm font-medium">
            Owner
          </label>
          <select
            id="owner_id"
            name="owner_id"
            defaultValue={contact?.owner_id ?? ""}
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
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={contact?.email ?? ""}
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
            defaultValue={contact?.phone ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="mobile_phone" className="text-sm font-medium">
            Mobile
          </label>
          <input
            id="mobile_phone"
            name="mobile_phone"
            defaultValue={contact?.mobile_phone ?? ""}
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
            defaultValue={contact?.linkedin_url ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Job title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={contact?.title ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="buying_role" className="text-sm font-medium">
            Buying role
          </label>
          <select
            id="buying_role"
            name="buying_role"
            defaultValue={contact?.buying_role ?? ""}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="decision_maker">Decision maker</option>
            <option value="champion">Champion</option>
            <option value="influencer">Influencer</option>
            <option value="gatekeeper">Gatekeeper</option>
            <option value="end_user">End user</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="preferred_contact_method"
            className="text-sm font-medium"
          >
            Prefers
          </label>
          <select
            id="preferred_contact_method"
            name="preferred_contact_method"
            defaultValue={contact?.preferred_contact_method ?? ""}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text</option>
            <option value="slack">Slack</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="timezone" className="text-sm font-medium">
            Timezone
          </label>
          <input
            id="timezone"
            name="timezone"
            placeholder="ET, PT, GMT…"
            defaultValue={contact?.timezone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name="is_primary"
            defaultChecked={contact?.is_primary}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Main point of contact for this account
        </label>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name="do_not_contact"
            defaultChecked={contact?.do_not_contact}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Do not contact — keep them on file, off outreach
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={contact?.notes ?? ""}
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

"use client";

import { useState } from "react";

type Profile = { id: string; full_name: string | null; email: string };
type AccountOption = { id: string; name: string };
type ContactOption = {
  id: string;
  first_name: string;
  last_name: string | null;
  account_id: string | null;
};
type StageOption = { id: string; name: string };

type Deal = {
  id?: string;
  account_id?: string;
  primary_contact_id?: string | null;
  name?: string;
  stage_id?: string;
  value?: number | null;
  expected_close_date?: string | null;
  source?: string | null;
  notes?: string | null;
  owner_id?: string | null;
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent";

export function DealForm({
  deal,
  accounts,
  contacts,
  stages,
  profiles,
  action,
  submitLabel,
}: {
  deal?: Deal;
  accounts: AccountOption[];
  contacts: ContactOption[];
  stages: StageOption[];
  profiles: Profile[];
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  const [accountId, setAccountId] = useState(deal?.account_id ?? "");

  // Only offer contacts that belong to the selected account.
  const availableContacts = contacts.filter(
    (contact) => contact.account_id === accountId
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      {deal?.id && <input type="hidden" name="id" value={deal.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Deal name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Q3 Brand Refresh"
          defaultValue={deal?.name}
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
            required
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select an account
            </option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="primary_contact_id" className="text-sm font-medium">
            Primary contact
          </label>
          <select
            id="primary_contact_id"
            name="primary_contact_id"
            defaultValue={deal?.primary_contact_id ?? ""}
            disabled={accountId === ""}
            className={`${inputClass} disabled:opacity-60`}
          >
            <option value="">
              {accountId === ""
                ? "Pick an account first"
                : availableContacts.length === 0
                  ? "No contacts at this account"
                  : "None"}
            </option>
            {availableContacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {[contact.first_name, contact.last_name]
                  .filter(Boolean)
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="stage_id" className="text-sm font-medium">
            Stage
          </label>
          <select
            id="stage_id"
            name="stage_id"
            required
            defaultValue={deal?.stage_id ?? stages[0]?.id}
            className={inputClass}
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
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
            defaultValue={deal?.owner_id ?? ""}
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
          <label htmlFor="value" className="text-sm font-medium">
            Value (USD)
          </label>
          <input
            id="value"
            name="value"
            type="number"
            step="0.01"
            min="0"
            defaultValue={deal?.value ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="expected_close_date" className="text-sm font-medium">
            Expected close
          </label>
          <input
            id="expected_close_date"
            name="expected_close_date"
            type="date"
            defaultValue={deal?.expected_close_date ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="source" className="text-sm font-medium">
          Source
        </label>
        <input
          id="source"
          name="source"
          placeholder="Referral, outbound, inbound…"
          defaultValue={deal?.source ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={deal?.notes ?? ""}
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

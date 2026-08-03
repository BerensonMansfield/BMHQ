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
  revenue_type?: string;
  recurring_amount?: number | null;
  billing_period?: string | null;
  contract_months?: number | null;
  expected_close_date?: string | null;
  source?: string | null;
  service_line?: string | null;
  probability?: number | null;
  next_step?: string | null;
  lost_reason?: string | null;
  competitor?: string | null;
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
  const [revenueType, setRevenueType] = useState(
    deal?.revenue_type ?? "one_time"
  );

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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="probability" className="text-sm font-medium">
            Probability (%)
          </label>
          <input
            id="probability"
            name="probability"
            type="number"
            min="0"
            max="100"
            placeholder="Defaults to the stage"
            defaultValue={deal?.probability ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-4 rounded-xl border border-border p-4">
        <legend className="px-1.5 text-sm font-medium">Revenue</legend>

        <div className="flex flex-wrap gap-4">
          {[
            { value: "one_time", label: "One-time project" },
            { value: "retainer", label: "Retainer" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="revenue_type"
                value={option.value}
                checked={revenueType === option.value}
                onChange={(event) => setRevenueType(event.target.value)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              {option.label}
            </label>
          ))}
        </div>

        {revenueType === "one_time" ? (
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
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="recurring_amount"
                className="text-sm font-medium"
              >
                Amount (USD)
              </label>
              <input
                id="recurring_amount"
                name="recurring_amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={deal?.recurring_amount ?? ""}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="billing_period" className="text-sm font-medium">
                Per
              </label>
              <select
                id="billing_period"
                name="billing_period"
                defaultValue={deal?.billing_period ?? "monthly"}
                className={inputClass}
              >
                <option value="monthly">Month</option>
                <option value="quarterly">Quarter</option>
                <option value="annual">Year</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contract_months" className="text-sm font-medium">
                Term (months)
              </label>
              <input
                id="contract_months"
                name="contract_months"
                type="number"
                min="1"
                placeholder="Optional"
                defaultValue={deal?.contract_months ?? ""}
                className={inputClass}
              />
            </div>
          </div>
        )}
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <label htmlFor="service_line" className="text-sm font-medium">
            Service line
          </label>
          <input
            id="service_line"
            name="service_line"
            placeholder="Marketing automation, CRM implementation…"
            defaultValue={deal?.service_line ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="next_step" className="text-sm font-medium">
          Next step
        </label>
        <input
          id="next_step"
          name="next_step"
          placeholder="Send the revised SOW by Friday"
          defaultValue={deal?.next_step ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lost_reason" className="text-sm font-medium">
            Lost reason
          </label>
          <input
            id="lost_reason"
            name="lost_reason"
            placeholder="Only if it went the wrong way"
            defaultValue={deal?.lost_reason ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="competitor" className="text-sm font-medium">
            Competitor
          </label>
          <input
            id="competitor"
            name="competitor"
            defaultValue={deal?.competitor ?? ""}
            className={inputClass}
          />
        </div>
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

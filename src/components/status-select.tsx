"use client";

/**
 * A status dropdown that saves as soon as it changes — no separate save
 * button. Must be rendered inside a form whose action handles the update.
 */
export function StatusSelect({
  name,
  defaultValue,
  options,
  label,
}: {
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      aria-label={label}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="rounded-md border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

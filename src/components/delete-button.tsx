"use client";

export function DeleteButton({ confirmText }: { confirmText: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirm(confirmText)) event.preventDefault();
      }}
      className="rounded-lg border border-bad/30 px-4 py-2 text-sm font-medium text-bad transition-colors hover:bg-bad/10"
    >
      Delete
    </button>
  );
}

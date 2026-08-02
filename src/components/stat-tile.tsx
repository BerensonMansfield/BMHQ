import Link from "next/link";

/**
 * A headline number with its label and an optional bit of context beneath.
 * Proportional figures on purpose — tabular-nums is for columns, and it reads
 * loose at display sizes.
 */
export function StatTile({
  label,
  value,
  context,
  href,
  tone = "default",
}: {
  label: string;
  value: string;
  context?: string;
  href?: string;
  tone?: "default" | "warn";
}) {
  const body = (
    <>
      <p className="text-xs uppercase tracking-[0.08em] text-muted">{label}</p>
      <p
        className={`mt-2 text-3xl font-semibold ${
          tone === "warn" ? "text-warn" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {context && <p className="mt-1 text-xs text-muted">{context}</p>}
    </>
  );

  const className =
    "block rounded-xl border border-border bg-surface p-5 transition-colors";

  return href ? (
    <Link href={href} className={`${className} hover:border-accent`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

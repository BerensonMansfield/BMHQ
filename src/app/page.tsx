import Link from "next/link";

const modules = [
  {
    href: "/accounts",
    label: "Accounts",
    description: "Client companies — prospects and active clients.",
  },
  {
    href: "/contacts",
    label: "Contacts",
    description: "People, tied to an account or standing alone as a lead.",
  },
  {
    href: "/deals",
    label: "Deals",
    description: "Sales in progress, moving through the pipeline.",
  },
  {
    href: "/projects",
    label: "Projects",
    description: "Delivery work — for a client, or internal.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-wide text-accent font-medium">
        Internal systems
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-balance">
        The CRM and the delivery board, in one place.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Pilot v0.1 — accounts, contacts, and deals feed straight into
        projects, milestones, and tasks.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent"
          >
            <h2 className="font-display text-xl">{mod.label}</h2>
            <p className="mt-2 text-sm text-muted">{mod.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

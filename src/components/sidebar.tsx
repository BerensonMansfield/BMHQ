"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import {
  DashboardIcon,
  AccountsIcon,
  ContactsIcon,
  DealsIcon,
  ProjectsIcon,
  SignOutIcon,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => React.ReactElement;
};

const GROUPS: { heading: string | null; items: NavItem[] }[] = [
  {
    heading: null,
    items: [{ href: "/", label: "Dashboard", Icon: DashboardIcon }],
  },
  {
    heading: "Clients",
    items: [
      { href: "/accounts", label: "Accounts", Icon: AccountsIcon },
      { href: "/contacts", label: "Contacts", Icon: ContactsIcon },
      { href: "/deals", label: "Deals", Icon: DealsIcon },
    ],
  },
  {
    heading: "Delivery",
    items: [{ href: "/projects", label: "Projects", Icon: ProjectsIcon }],
  },
];

function isActive(pathname: string, href: string) {
  // "/" would otherwise match every route.
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col gap-8 border-b border-border bg-surface px-4 py-6 md:h-dvh md:w-60 md:overflow-y-auto md:border-r md:border-b-0">
      <Link href="/" className="px-2 font-display text-lg leading-tight">
        Berenson &amp; Mansfield
        <span className="mt-0.5 block text-xs font-sans uppercase tracking-[0.14em] text-accent">
          HQ
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-6">
        {GROUPS.map((group, index) => (
          <div key={group.heading ?? index} className="flex flex-col gap-1">
            {group.heading && (
              <h2 className="px-2 pb-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                {group.heading}
              </h2>
            )}

            {group.items.map(({ href, label, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${
                    active
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-muted hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <p className="truncate px-2 text-xs text-muted" title={userEmail}>
          {userEmail}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <SignOutIcon />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

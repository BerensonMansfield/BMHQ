"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";

const links = [
  { href: "/accounts", label: "Accounts" },
  { href: "/contacts", label: "Contacts" },
  { href: "/deals", label: "Deals" },
  { href: "/projects", label: "Projects" },
];

export function Nav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg tracking-tight">
          Berenson &amp; Mansfield <span className="text-accent">HQ</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-accent font-medium"
                    : "text-muted transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            );
          })}
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <span className="text-muted">{userEmail}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-muted transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

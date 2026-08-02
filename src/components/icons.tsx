/**
 * 16px stroke icons, sized by the surrounding text. Kept inline rather than
 * pulled from a package — there are only six, and they never need to vary.
 */

type IconProps = { className?: string };

function Svg({
  children,
  className,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-4 w-4 shrink-0"}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="2" width="5" height="6" rx="1" />
      <rect x="9" y="2" width="5" height="4" rx="1" />
      <rect x="2" y="10" width="5" height="4" rx="1" />
      <rect x="9" y="8" width="5" height="6" rx="1" />
    </Svg>
  );
}

export function AccountsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2 14h12" />
      <path d="M3 14V3a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v11" />
      <path d="M10 14V6h3a1 1 0 0 1 1 1v7" />
      <path d="M5.5 5h2M5.5 8h2M5.5 11h2" />
    </Svg>
  );
}

export function ContactsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="5.5" r="2.5" />
      <path d="M1.5 14a4.5 4.5 0 0 1 9 0" />
      <path d="M11 3.5a2.5 2.5 0 0 1 0 4.5" />
      <path d="M12 10.5a4 4 0 0 1 2.5 3.5" />
    </Svg>
  );
}

export function DealsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4 9 9 6.5 6.5 2 11" />
      <path d="M10.5 4H14v3.5" />
      <path d="M2 14h12" />
    </Svg>
  );
}

export function ProjectsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6h12" />
      <path d="M5 1.5v2M11 1.5v2" />
      <path d="M5 9.5h2.5M5 11.5h4.5" />
    </Svg>
  );
}

export function SignOutIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 14H3.5A1.5 1.5 0 0 1 2 12.5v-9A1.5 1.5 0 0 1 3.5 2H6" />
      <path d="M10.5 11 14 8l-3.5-3" />
      <path d="M14 8H6" />
    </Svg>
  );
}

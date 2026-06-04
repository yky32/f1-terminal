type LogoIconProps = {
  className?: string;
};

/** Abstract grid mark — swap for your product logo. */
export function LogoIcon({ className = "h-10 w-10" }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`aspect-square shrink-0 text-foreground ${className}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="40" height="40" rx="12" fill="currentColor" />
      <rect x="14" y="14" width="8" height="8" rx="2" fill="#ffffff" opacity="0.95" />
      <rect x="26" y="14" width="8" height="8" rx="2" fill="#ffffff" opacity="0.75" />
      <rect x="14" y="26" width="8" height="8" rx="2" fill="#ffffff" opacity="0.75" />
      <rect x="26" y="26" width="8" height="8" rx="2" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

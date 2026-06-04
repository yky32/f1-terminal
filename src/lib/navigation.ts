export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  description: string;
};

export const mainNav: NavItem[] = [
  {
    href: "/",
    label: "Global",
    shortLabel: "Global",
    description: "Live and upcoming Grand Prix worldwide",
  },
  {
    href: "/races",
    label: "Races",
    shortLabel: "Races",
    description: "Grand Prix dashboards and session detail",
  },
];

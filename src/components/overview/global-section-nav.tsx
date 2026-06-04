"use client";

import { glassFocus, glassInset } from "@/components/glass-surface";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "global-map", label: "Map" },
  { id: "global-regions", label: "Regions" },
  { id: "global-calendar", label: "Calendar" },
  { id: "global-standings", label: "Standings" },
  { id: "weekend-monitor", label: "Monitor" },
] as const;

export function GlobalSectionNav() {
  return (
    <nav
      className="sticky top-[4.25rem] z-40 border-b border-black/[0.06] bg-background/90 backdrop-blur-md md:hidden"
      aria-label="Global page sections"
    >
      <div className="page-container flex gap-1 overflow-x-auto py-2 overscroll-x-contain">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className={cn(
              glassInset,
              glassFocus,
              "shrink-0 rounded-full px-3 py-2 text-[0.75rem] font-semibold text-neutral-700 transition-colors hover:text-neutral-950",
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

"use client";

import { Globe2, MonitorDot, type LucideIcon } from "lucide-react";
import { glassFocus, glassHover, glassInset } from "@/components/glass-surface";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

function JumpIconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        glassInset,
        glassHover,
        glassFocus,
        "flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:text-neutral-950",
      )}
    >
      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
    </button>
  );
}

export function GlobalPageHeader() {
  return (
    <header className="page-container pt-10 pb-8 sm:pt-12 sm:pb-10">
      <div className="flex items-start justify-between gap-5 sm:gap-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-title max-w-4xl font-semibold text-neutral-950">
            Monitor F1 everywhere.
          </h1>
          <p className="text-body-large mt-7 max-w-3xl text-neutral-700 sm:mt-8">
            Live and upcoming Grand Prix on a global map — with race weekend coverage and session
            monitoring when you need it.
          </p>
        </div>

        <div
          className={cn(glassInset, "flex shrink-0 items-center gap-1 rounded-full p-1")}
          role="group"
          aria-label="Jump to section"
        >
          <JumpIconButton
            icon={Globe2}
            label="Jump to map"
            onClick={() => scrollToSection("global-map")}
          />
          <JumpIconButton
            icon={MonitorDot}
            label="Jump to weekend monitor"
            onClick={() => scrollToSection("weekend-monitor")}
          />
        </div>
      </div>
    </header>
  );
}

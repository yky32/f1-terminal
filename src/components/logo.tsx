import Link from "next/link";
import { LogoIcon } from "@/components/logo-icon";
import { PRODUCT_NAME } from "@/lib/metadata";
import { cn } from "@/lib/utils";

type LogoProps = {
  showText?: boolean;
  size?: "default" | "compact";
};

export function Logo({ showText = true, size = "default" }: LogoProps) {
  const compact = size === "compact";

  return (
    <Link
      href="/"
      className={cn(
        "flex h-10 min-w-0 shrink items-center transition-opacity hover:opacity-80",
        compact ? "gap-2" : "gap-2.5 sm:gap-3",
      )}
    >
      <LogoIcon
        className={cn(
          "shrink-0 -translate-y-px",
          compact ? "h-7 w-7" : "h-10 w-10",
        )}
      />
      {showText ? (
        <span
          className={cn(
            "truncate font-semibold leading-none tracking-[-0.03em] text-foreground",
            compact ? "text-[0.875rem] tracking-[-0.02em]" : "text-label",
          )}
        >
          {PRODUCT_NAME}
        </span>
      ) : null}
    </Link>
  );
}

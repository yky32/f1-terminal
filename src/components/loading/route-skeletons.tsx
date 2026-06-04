import { cn } from "@/lib/utils";

export function TerminalPageSkeleton() {
  return (
    <div className="space-y-0">
      <div className="page-container pt-10 pb-6 sm:pt-12">
        <div className="h-9 w-64 max-w-full animate-pulse rounded-lg bg-black/[0.06]" />
        <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded-lg bg-black/[0.04]" />
      </div>
      <div
        className={cn(
          "relative w-full animate-pulse overflow-hidden bg-black/[0.04]",
          "h-[min(92vh,calc(100dvh-4.25rem))] min-h-[30rem]",
        )}
        aria-busy="true"
        aria-label="Loading primary view"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200/40 via-neutral-100/20 to-neutral-200/30" />
      </div>
      <div className="page-container py-10">
        <div className="min-h-[22rem] animate-pulse rounded-[1.25rem] bg-black/[0.05]" />
      </div>
    </div>
  );
}

type MapSectionSkeletonProps = {
  variant?: "map" | "monitor" | "compact";
  className?: string;
};

export function MapSectionSkeleton({
  variant = "map",
  className,
}: MapSectionSkeletonProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn("animate-pulse bg-black/[0.05]", className)}
        aria-busy="true"
        aria-label="Loading map"
      />
    );
  }

  if (variant === "monitor") {
    return (
      <div className="page-container py-10" aria-busy="true" aria-label="Loading monitor">
        <div className="mb-6 h-8 w-72 animate-pulse rounded-lg bg-black/[0.06]" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-[1.25rem] bg-black/[0.05]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full animate-pulse overflow-hidden bg-black/[0.04]",
        "h-[min(92vh,calc(100dvh-4.25rem))] min-h-[30rem]",
        className,
      )}
      aria-busy="true"
      aria-label="Loading map"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200/40 via-neutral-100/20 to-neutral-200/30" />
    </div>
  );
}

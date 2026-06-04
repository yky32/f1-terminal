"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppChromeProvider, useAppChrome } from "@/components/app-chrome-context";
import { Logo } from "@/components/logo";
import { MobileHeaderNav } from "@/components/mobile-header-nav";
import { SiteFooter } from "@/components/site-footer";
import { UserMenu } from "@/components/user-menu";
import { UserPreferencesProvider } from "@/components/user-preferences-provider";
import { glassInset, glassStrong } from "@/components/glass-surface";
import { PageBackdrop } from "@/components/page-backdrop";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function ChevronRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-muted-light transition-transform group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppChromeProvider>
      <UserPreferencesProvider>
        <AppShellFrame>{children}</AppShellFrame>
      </UserPreferencesProvider>
    </AppChromeProvider>
  );
}

function AppShellFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { headerHidden } = useAppChrome();

  return (
    <div className="flex min-h-full flex-col">
      {!headerHidden ? (
        <header
          id="app-site-header"
          className={`sticky top-0 z-50 ${glassStrong} rounded-none border-x-0 border-t-0 border-b border-black/[0.08]`}
        >
          <div className="page-container flex h-[4.25rem] items-center justify-between gap-3">
            <Logo />

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <nav className="hidden items-center gap-1 md:flex">
                {mainNav.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-label inline-flex h-10 items-center justify-center rounded-full px-4 font-medium leading-none transition-colors ${
                        isActive
                          ? "bg-foreground text-background"
                          : cn(glassInset, "text-muted hover:text-foreground")
                      }`}
                    >
                      {item.shortLabel}
                    </Link>
                  );
                })}
              </nav>

              <MobileHeaderNav pathname={pathname} className="md:hidden" />

              <UserMenu />
            </div>
          </div>
        </header>
      ) : null}

      <main className="app-page relative flex min-h-0 flex-1 flex-col">
        <PageBackdrop />
        <div className="relative z-[1] flex flex-1 flex-col">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

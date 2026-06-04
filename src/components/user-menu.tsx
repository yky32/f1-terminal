"use client";

import {
  Banknote,
  CircleUser,
  Clock,
  Globe,
  LogIn,
  Moon,
  Sun,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { glassFocus, glassInset, glassStrong } from "@/components/glass-surface";
import { useUserPreferences } from "@/components/user-preferences-provider";
import {
  CURRENCY_OPTIONS,
  DARK_MODE_ENABLED,
  LOCALE_OPTIONS,
  type CurrencyCode,
  type ThemePreference,
} from "@/lib/user-preferences";
import { buildTimeZoneOptions } from "@/lib/timezone";
import { cn } from "@/lib/utils";

const MENU_Z_BACKDROP = 200;
const MENU_Z_PANEL = 201;
const MENU_GAP_PX = 8;
const APP_HEADER_ID = "app-site-header";

type MenuPosition = {
  top: number;
  right: number;
  headerBottom: number;
};

function headerBottomForTrigger(trigger: HTMLElement) {
  const header =
    trigger.closest("header") ?? document.getElementById(APP_HEADER_ID);
  return header?.getBoundingClientRect().bottom ?? trigger.getBoundingClientRect().bottom;
}

function MenuSection({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-3 py-2.5", className)}>
      <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-neutral-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useUserPreferences();

  const options: {
    value: ThemePreference;
    label: string;
    icon: typeof Sun;
    disabled?: boolean;
  }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon, disabled: !DARK_MODE_ENABLED },
  ];

  return (
    <div
      className={cn(glassInset, "flex gap-0.5 rounded-full p-0.5")}
      role="group"
      aria-label="Theme"
    >
      {options.map(({ value, label, icon: Icon, disabled }) => {
        const active = theme === value;

        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => setTheme(value)}
            aria-pressed={active}
            title={disabled ? "Dark mode coming soon" : undefined}
            className={cn(
              glassFocus,
              "flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[0.6875rem] font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-neutral-600 hover:text-neutral-950",
              disabled && "cursor-not-allowed opacity-45",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function PreferenceSelect<T extends string>({
  id,
  value,
  onChange,
  options,
  icon: Icon,
  disabled,
}: {
  id: string;
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<{ code: T; label: string }>;
  icon: typeof Globe;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
        aria-hidden
      />
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(
          glassInset,
          glassFocus,
          "w-full appearance-none rounded-lg py-2 pl-8 pr-3 text-[0.8125rem] font-medium text-neutral-800",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function UserMenuPanel({
  menuId,
  position,
  onClose,
}: {
  menuId: string;
  position: MenuPosition;
  onClose: () => void;
}) {
  const { locale, currency, timeZone, setLocale, setCurrency, setTimeZone } = useUserPreferences();
  const timeZoneOptions = useMemo(() => buildTimeZoneOptions(timeZone), [timeZone]);

  return (
    <>
      <button
        type="button"
        className="user-menu-backdrop-enter fixed right-0 bottom-0 left-0 cursor-default bg-black/[0.14] motion-reduce:animate-none"
        style={{ top: position.headerBottom, zIndex: MENU_Z_BACKDROP }}
        aria-label="Close account menu"
        onClick={onClose}
      />
      <div
        id={menuId}
        role="menu"
        style={{
          position: "fixed",
          top: position.top,
          right: position.right,
          zIndex: MENU_Z_PANEL,
        }}
        className={cn(
          glassStrong,
          "user-menu-liquid motion-reduce:animate-none",
          "w-[min(17rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-black/[0.06] py-1 shadow-[0_12px_32px_rgba(15,23,42,0.14)]",
        )}
      >
        <button
          type="button"
          role="menuitem"
          disabled
          aria-disabled
          title="Sign in coming soon"
          className={cn(
            glassFocus,
            "flex w-full cursor-not-allowed items-center gap-2.5 px-3.5 py-2.5 text-left text-[0.8125rem] font-medium text-neutral-500",
          )}
        >
          <LogIn className="h-4 w-4 shrink-0 opacity-60" strokeWidth={2} aria-hidden />
          <span>Sign in</span>
          <span className="ml-auto rounded-full bg-neutral-900/6 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-neutral-400">
            Soon
          </span>
        </button>

        <div className="mx-3 border-t border-black/[0.06]" aria-hidden />

        <MenuSection label="Appearance">
          <ThemeToggle />
        </MenuSection>

        <div className="mx-3 border-t border-black/[0.06]" aria-hidden />

        <MenuSection label="Language">
          <PreferenceSelect
            id={`${menuId}-locale`}
            value={locale}
            onChange={setLocale}
            options={LOCALE_OPTIONS}
            disabled={LOCALE_OPTIONS.length <= 1}
            icon={Globe}
          />
        </MenuSection>

        <MenuSection label="Timezone" className="pt-0">
          <PreferenceSelect
            id={`${menuId}-timezone`}
            value={timeZone}
            onChange={setTimeZone}
            options={timeZoneOptions}
            icon={Clock}
          />
        </MenuSection>

        <MenuSection label="Currency" className="pt-0">
          <PreferenceSelect<CurrencyCode>
            id={`${menuId}-currency`}
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS.map((option) => ({
              code: option.code,
              label: `${option.label} (${option.symbol})`,
            }))}
            icon={Banknote}
          />
        </MenuSection>
      </div>
    </>
  );
}

export function UserMenu() {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + MENU_GAP_PX,
      right: Math.max(12, window.innerWidth - rect.right),
      headerBottom: headerBottomForTrigger(trigger),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, updatePosition]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-label="Open account menu"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          glassInset,
          glassFocus,
          "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-700 transition-colors hover:text-neutral-950",
        )}
      >
        <CircleUser className="h-[1.25rem] w-[1.25rem]" strokeWidth={1.75} aria-hidden />
      </button>

      {open && position
        ? createPortal(
            <UserMenuPanel menuId={menuId} position={position} onClose={() => setOpen(false)} />,
            document.body,
          )
        : null}
    </>
  );
}

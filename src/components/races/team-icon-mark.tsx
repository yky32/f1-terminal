import type { ComponentType, SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement>;

function RedBullMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M8.5 18.5c0-4.5 1.5-7.5 3.5-9.5-.5 3-1.5 5.5-3.5 9.5Z"
        fill="currentColor"
      />
      <path
        d="M15.5 18.5c0-4.5-1.5-7.5-3.5-9.5.5 3 1.5 5.5 3.5 9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function McLarenMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M5 18 13 6h4L11 18H5Z" fill="currentColor" />
      <path d="M10 18 18 6h4l-8 12h-4Z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function FerrariMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 4.5 18.5 7v7c0 3.2-3.2 5.8-6.5 6.8C8.7 19.8 5.5 17.2 5.5 14V7L12 4.5Z"
        fill="currentColor"
      />
      <path d="M6.5 11.5h11" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
    </svg>
  );
}

function MercedesMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 5.5 13.6 10h4.9l-4 2.9 1.5 4.6L12 15.8 8 17.5l1.5-4.6-4-2.9h4.9L12 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AstonMartinMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4 14.5c2.5-4.5 5-6.5 8-6.5s5.5 2 8 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.5 14.5h11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlpineMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M12 5 18 18H6L12 5Z" fill="currentColor" />
      <path d="M12 10 15.5 18h-7L12 10Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

function WilliamsMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M6 6v12M6 6h5.5l-3 6 3 6H6M14 6v12M14 12h4.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RbMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="9.5" cy="12" r="5.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="14.5" cy="12" r="5.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SauberMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HaasMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M7 6v12M7 6h4.5a3 3 0 0 1 0 6H7M16 6v12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DefaultMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M9.5 12h5M12 9.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const TEAM_MARKS: Record<string, ComponentType<MarkProps>> = {
  RBR: RedBullMark,
  MCL: McLarenMark,
  FER: FerrariMark,
  MER: MercedesMark,
  AMR: AstonMartinMark,
  ALP: AlpineMark,
  WIL: WilliamsMark,
  RB: RbMark,
  SAU: SauberMark,
  HAA: HaasMark,
};

export function getTeamIconMark(abbr: string) {
  return TEAM_MARKS[abbr] ?? DefaultMark;
}

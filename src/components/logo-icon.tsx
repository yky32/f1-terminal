import { BRAND_ACCENT, getBrandLogoMark } from "@/lib/brand-logo-mark";
import type { LogoLine } from "@/lib/logo-geometry";

type LogoIconProps = {
  className?: string;
};

function renderLine(line: LogoLine, key: string) {
  const stroke = line.accent ? BRAND_ACCENT : "currentColor";
  const opacity = line.opacity ?? (line.accent ? 1 : 0.92);

  return (
    <path
      key={key}
      d={line.d}
      fill="none"
      stroke={stroke}
      strokeWidth={line.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

export function LogoIcon({ className = "h-10 w-10" }: LogoIconProps) {
  const mark = getBrandLogoMark();

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`aspect-square shrink-0 text-foreground ${className}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {renderLine(mark.ground, "ground")}
      {mark.lower.map((line, index) => renderLine(line, `lower-${index}`))}
      {mark.frontWing.map((line, index) => renderLine(line, `front-wing-${index}`))}
      {renderLine(mark.upper, "upper")}
      {mark.driver.map((line, index) => renderLine(line, `driver-${index}`))}
      {mark.rearWing.map((line, index) => renderLine(line, `rear-wing-${index}`))}

      {mark.wheels.map((wheel, index) => (
        <circle
          key={`wheel-${index}`}
          cx={wheel.cx}
          cy={wheel.cy}
          r={wheel.r}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
        />
      ))}
    </svg>
  );
}

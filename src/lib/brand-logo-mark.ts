import { getBrandLogoLines, type LogoLine, type LogoWheel } from "@/lib/logo-geometry";

export const BRAND_ACCENT = "#E10600";

export type BrandLogoMark = ReturnType<typeof getBrandLogoLines>;

export function getBrandLogoMark(): BrandLogoMark {
  return getBrandLogoLines();
}

type BrandLogoMarkSvgOptions = {
  /** Line color for standalone SVG exports (favicon). */
  ink?: string;
};

function lineToSvg(line: LogoLine, ink: string) {
  const stroke = line.accent ? BRAND_ACCENT : ink;
  const opacity = line.opacity ?? (line.accent ? 1 : 0.92);

  return `<path d="${line.d}" fill="none" stroke="${stroke}" stroke-width="${line.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
}

function wheelToSvg(wheel: LogoWheel, ink: string) {
  return `<circle cx="${wheel.cx.toFixed(2)}" cy="${wheel.cy.toFixed(2)}" r="${wheel.r.toFixed(2)}" fill="none" stroke="${ink}" stroke-width="1.7"/>`;
}

export function brandLogoMarkSvg({ ink = "#0a0a0a" }: BrandLogoMarkSvgOptions = {}) {
  const mark = getBrandLogoMark();

  const lines = [
    mark.ground,
    ...mark.lower,
    ...mark.frontWing,
    mark.upper,
    ...mark.driver,
    ...mark.rearWing,
  ]
    .map((line) => lineToSvg(line, ink))
    .join("");

  const wheels = mark.wheels.map((wheel) => wheelToSvg(wheel, ink)).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">${lines}${wheels}</svg>`;
}

export function brandLogoMarkDataUrl(options?: BrandLogoMarkSvgOptions) {
  return `data:image/svg+xml,${encodeURIComponent(brandLogoMarkSvg(options))}`;
}

export function pointsToPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M${first.x.toFixed(2)} ${first.y.toFixed(2)}${rest.map((p) => ` L${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join("")}`;
}

export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = (startDeg * Math.PI) / 180;
  const end = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export type LogoLine = {
  d: string;
  strokeWidth: number;
  accent?: boolean;
  opacity?: number;
};

export type LogoWheel = {
  cx: number;
  cy: number;
  r: number;
};

/** Abstract side-elevation — low deck with cockpit dip, extended nose. */
export function f1UpperOutline(): LogoLine {
  return {
    d: pointsToPath([
      { x: 0.6, y: 31.0 },
      { x: 1.8, y: 30.5 },
      { x: 4.2, y: 29.1 },
      { x: 7.2, y: 27.5 },
      { x: 10.8, y: 26.3 },
      { x: 14.0, y: 25.6 },
      { x: 17.5, y: 25.1 },
      { x: 21.0, y: 25.0 },
      { x: 23.2, y: 25.05 },
      { x: 24.5, y: 25.65 },
      { x: 25.8, y: 25.05 },
      { x: 28.5, y: 25.0 },
      { x: 33.5, y: 25.2 },
      { x: 36.5, y: 25.4 },
      { x: 37.8, y: 24.2 },
      { x: 38.8, y: 21.0 },
      { x: 40.2, y: 17.8 },
      { x: 42.8, y: 16.8 },
      { x: 43.2, y: 18.8 },
      { x: 41.8, y: 21.5 },
      { x: 40.5, y: 23.8 },
    ]),
    strokeWidth: 1.85,
  };
}

/** Floor + splitter — tight to the wheel line. */
export function f1LowerOutline(): LogoLine[] {
  return [
    {
      d: pointsToPath([
        { x: 1.8, y: 32.5 },
        { x: 11.0, y: 32.6 },
        { x: 13.5, y: 32.3 },
      ]),
      strokeWidth: 1.55,
      opacity: 0.9,
    },
    {
      d: pointsToPath([
        { x: 17.5, y: 32.2 },
        { x: 28.5, y: 32.0 },
        { x: 31.0, y: 32.3 },
      ]),
      strokeWidth: 1.55,
      opacity: 0.9,
    },
    {
      d: pointsToPath([
        { x: 35.5, y: 32.2 },
        { x: 41.0, y: 31.8 },
      ]),
      strokeWidth: 1.55,
      opacity: 0.9,
    },
  ];
}

/** Minimal front wing suggestion — low and horizontal. */
export function f1FrontWingOutline(): LogoLine[] {
  return [
    {
      d: pointsToPath([
        { x: 0.2, y: 31.6 },
        { x: 10.5, y: 29.0 },
      ]),
      strokeWidth: 1.45,
    },
    {
      d: pointsToPath([
        { x: 0.6, y: 30.2 },
        { x: 9.0, y: 28.0 },
      ]),
      strokeWidth: 1.2,
      opacity: 0.75,
    },
  ];
}

/** Rear wing — flatter planes, shorter endplate. */
export function f1RearWingOutline(): LogoLine[] {
  return [
    {
      d: pointsToPath([
        { x: 40.8, y: 16.5 },
        { x: 40.8, y: 22.5 },
      ]),
      strokeWidth: 1.35,
      accent: true,
    },
    {
      d: pointsToPath([
        { x: 38.5, y: 17.8 },
        { x: 44.2, y: 17.2 },
      ]),
      strokeWidth: 1.6,
      accent: true,
    },
    {
      d: pointsToPath([
        { x: 39.0, y: 20.2 },
        { x: 43.8, y: 19.6 },
      ]),
      strokeWidth: 1.35,
      accent: true,
      opacity: 0.9,
    },
  ];
}

/** Driver cockpit — sits in the upper-body dip, same ink as the body. */
export function f1DriverCockpitLines(): LogoLine[] {
  return [
    {
      d: arcPath(24.5, 25.1, 2.85, 200, 340),
      strokeWidth: 1.5,
      opacity: 0.94,
    },
    {
      d: arcPath(24.5, 24.3, 1.4, 190, 350),
      strokeWidth: 1.35,
      opacity: 0.9,
    },
    {
      d: pointsToPath([
        { x: 23.5, y: 25.45 },
        { x: 25.5, y: 25.45 },
      ]),
      strokeWidth: 1.15,
      opacity: 0.7,
    },
  ];
}

/** Large open-wheel circles — outline only. */
export function f1WheelOutlines(): LogoWheel[] {
  return [
    { cx: 14.5, cy: 32.0, r: 5.0 },
    { cx: 33.5, cy: 32.0, r: 5.0 },
  ];
}

/** Track surface — subtle wave, ~1px below wheels (not dead flat). */
export function f1GroundLine(): LogoLine {
  return {
    d: [
      "M0.20 38.02",
      "Q5.80 37.78 11.40 38.16",
      "T22.60 37.94",
      "T33.80 38.22",
      "T44.80 38.04",
    ].join(" "),
    strokeWidth: 1.35,
    opacity: 0.8,
  };
}

export function getBrandLogoLines() {
  return {
    ground: f1GroundLine(),
    upper: f1UpperOutline(),
    lower: f1LowerOutline(),
    frontWing: f1FrontWingOutline(),
    rearWing: f1RearWingOutline(),
    driver: f1DriverCockpitLines(),
    wheels: f1WheelOutlines(),
  };
}

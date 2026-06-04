export type MapSessionMode = "live" | "upcoming";

export function isMapSessionMode(value: string | null): value is MapSessionMode {
  return value === "live" || value === "upcoming";
}

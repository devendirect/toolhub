export type Density = "compact" | "regular" | "comfy";

export function densityGridCols(density: string): string {
  if (density === "compact") return "grid-cols-4";
  if (density === "comfy")   return "grid-cols-2";
  return "grid-cols-3";
}

import type { EyeShape } from "@/types/classification";

export function formatShapeLabel(shape: EyeShape): string {
  return shape.charAt(0).toUpperCase() + shape.slice(1);
}

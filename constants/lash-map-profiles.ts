import type { EyeShape } from "@/types/classification";

/** Lash cluster heights (inner → outer) for the results map illustration. */
export interface LashMapVisualProfile {
  /** Nine lash clusters along the lash line. */
  lengths: [number, number, number, number, number, number, number, number, number];
  /** Horizontal fan direction per cluster: negative = inward, positive = outward. */
  tilts: [number, number, number, number, number, number, number, number, number];
  /** Which zone gets a soft highlight ring. */
  emphasis: "inner" | "center" | "outer" | "balanced";
  tip: string;
}

export const LASH_MAP_PROFILES: Record<EyeShape, LashMapVisualProfile> = {
  hooded: {
    lengths: [10, 14, 22, 30, 36, 30, 22, 14, 10],
    tilts: [-2, -1, 0, 1, 2, 1, 0, -1, -2],
    emphasis: "center",
    tip: "Longest lengths at the centre open and lift the lid.",
  },
  almond: {
    lengths: [16, 20, 24, 28, 32, 28, 24, 20, 16],
    tilts: [-2, -1, -1, 0, 1, 1, 0, -1, -2],
    emphasis: "balanced",
    tip: "A gentle dome follows your natural balanced shape.",
  },
  round: {
    lengths: [12, 14, 18, 22, 26, 32, 38, 34, 26],
    tilts: [-1, 0, 1, 2, 3, 4, 5, 4, 3],
    emphasis: "outer",
    tip: "Extra length at the outer corner elongates the eye.",
  },
  monolid: {
    lengths: [14, 16, 18, 20, 22, 20, 18, 16, 14],
    tilts: [-1, -1, 0, 0, 0, 0, 0, -1, -1],
    emphasis: "balanced",
    tip: "Light, even placement keeps the lid looking sleek.",
  },
  upturned: {
    lengths: [12, 16, 20, 24, 28, 34, 40, 38, 30],
    tilts: [0, 1, 2, 3, 4, 5, 6, 5, 4],
    emphasis: "outer",
    tip: "Follow your natural upward sweep with a flared outer fan.",
  },
  downturned: {
    lengths: [14, 18, 22, 26, 28, 32, 36, 32, 24],
    tilts: [-1, 0, 1, 2, 3, 4, 5, 4, 2],
    emphasis: "outer",
    tip: "Outer-corner length creates a lifted, winged effect.",
  },
};

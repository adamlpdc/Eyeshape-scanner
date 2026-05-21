import type { EyeShape } from "@/types/classification";

export interface EyeShapeBeautyProfile {
  explanation: string;
  lashStyles: Array<{ name: string; detail: string }>;
  mapLabel: string;
}

export const RESULTS_COPY = {
  yourEyeShape: "Your eye shape",
  aboutShape: "About your shape",
  bestLashStyles: "Best lash styles for you",
  lashMap: "Recommended lash map",
  mapPlaceholder: "Illustration preview",
  alsoPossible: "Also possible",
} as const;

export const EYE_SHAPE_BEAUTY: Record<EyeShape, EyeShapeBeautyProfile> = {
  hooded: {
    explanation:
      "Your prominent brow bone and hidden crease give your eyes a smouldering look. Lashes that lift at the centre and outer corner help open and brighten your gaze.",
    lashStyles: [
      { name: "Wispy Cat Eye", detail: "Longer outer corners add lift without heaviness." },
      { name: "Open Dome", detail: "Centre-focused length opens the eye vertically." },
      { name: "Elevated Natural", detail: "Soft volume with a subtle upward sweep." },
    ],
    mapLabel: "Hooded lift map",
  },
  almond: {
    explanation:
      "Almond eyes taper gently at the corners with balanced proportions. This versatile shape suits most lash maps, from soft flutter to a polished cat-eye.",
    lashStyles: [
      { name: "Classic Cat", detail: "Graduated length follows your natural lash line." },
      { name: "Natural Full", detail: "Even density for polished everyday definition." },
      { name: "Soft Doll", detail: "Centre emphasis adds openness and softness." },
    ],
    mapLabel: "Almond balance map",
  },
  round: {
    explanation:
      "Round eyes have lovely vertical openness. Styles with extra length at the outer corner elongate the eye and create elegant balance.",
    lashStyles: [
      { name: "Cat Eye", detail: "Outer length creates a flattering elongating effect." },
      { name: "Winged Outer", detail: "Focused flare at the tail defines the shape." },
      { name: "Tapered Elongation", detail: "Shorter inner, longer outer — clean and lifted." },
    ],
    mapLabel: "Round elongation map",
  },
  monolid: {
    explanation:
      "Monolid eyes have a smooth upper lid with little visible crease. Lightweight, graduated lashes build dimension without weighing the lid down.",
    lashStyles: [
      { name: "Soft Flutter", detail: "Light, wispy lengths for everyday definition." },
      { name: "Graduated Open", detail: "Subtle increase from inner to outer corner." },
      { name: "Natural Wispy", detail: "Fine texture adds depth without bulk." },
    ],
    mapLabel: "Monolid dimension map",
  },
  upturned: {
    explanation:
      "Upturned eyes lift at the outer corners for a naturally feline look. Lash maps that follow this upward sweep enhance your shape with a refined finish.",
    lashStyles: [
      { name: "Fox Eye", detail: "Outer flare mirrors your natural lift." },
      { name: "Dramatic Cat", detail: "Bold tail for evening and editorial looks." },
      { name: "Lifted Outer Fan", detail: "Fan placement at the outer third adds drama." },
    ],
    mapLabel: "Upturned lift map",
  },
  downturned: {
    explanation:
      "Downturned eyes slope gently at the outer corners. Styles with lift at the outer edge brighten the gaze and create a more open appearance.",
    lashStyles: [
      { name: "Lifted Cat", detail: "Outer length counterbalances the natural slope." },
      { name: "Open Eye", detail: "Centre and outer focus create upward visual pull." },
      { name: "Doll Outer Emphasis", detail: "Soft centre with a lifted outer corner." },
    ],
    mapLabel: "Downturned lift map",
  },
};

import type { EyeShape } from "@/types/classification";

export interface EyeShapeBeautyProfile {
  tagline: string;
  characteristics: string;
  lashRecommendation: string;
  explanation: string;
  lashStyles: Array<{ name: string; detail: string }>;
  mapLabel: string;
}

export const EYE_SHAPE_BEAUTY: Record<EyeShape, EyeShapeBeautyProfile> = {
  hooded: {
    tagline: "Soft depth, lifted gaze",
    characteristics:
      "Your prominent brow bone and hidden crease give your eyes a mysterious, smouldering quality. Sometimes the eyelid can appear smaller, but lashes can open them right up.",
    lashRecommendation:
      "Choose styles that are longer in the centre to draw the focus forward and brighten your gaze.",
    explanation:
      "A hooded eye shape has a fuller upper lid that can gently cover the crease. Lash styles that lift from the center and outer corner help open the eye and create a more awake, refined look.",
    lashStyles: [
      { name: "Wispy Cat Eye", detail: "Longer outer corners add lift without heaviness." },
      { name: "Open Dome", detail: "Center-focused length opens the eye vertically." },
      { name: "Elevated Natural", detail: "Soft volume with a subtle upward sweep." },
    ],
    mapLabel: "Hooded lift map",
  },
  almond: {
    tagline: "Balanced, naturally tapered",
    characteristics:
      "Your eyes taper gently at the corners with balanced proportions — versatile, refined, and naturally symmetrical.",
    lashRecommendation:
      "Choose graduated lengths that follow your lash line for a polished, effortless finish.",
    explanation:
      "Almond eyes are slightly wider at the center with a gentle taper toward the corners. This versatile shape suits most lash maps — from soft everyday flutter to a polished cat-eye finish.",
    lashStyles: [
      { name: "Classic Cat", detail: "Graduated length follows your natural line." },
      { name: "Natural Full", detail: "Even density for polished everyday definition." },
      { name: "Soft Doll", detail: "Center emphasis adds openness and softness." },
    ],
    mapLabel: "Almond balance map",
  },
  round: {
    tagline: "Bright, open expression",
    characteristics:
      "Your eyes have lovely vertical openness that creates a bright, youthful look with plenty of visible lid space.",
    lashRecommendation:
      "Choose styles with extra length at the outer corner to elongate and balance your natural shape.",
    explanation:
      "Round eyes show more vertical openness, which creates a lively, youthful look. Styles that add length toward the outer corner help elongate the eye and create elegant balance.",
    lashStyles: [
      { name: "Cat Eye", detail: "Outer length creates a flattering elongating effect." },
      { name: "Winged Outer", detail: "Focused flare at the tail defines the shape." },
      { name: "Tapered Elongation", detail: "Shorter inner, longer outer — clean and lifted." },
    ],
    mapLabel: "Round elongation map",
  },
  monolid: {
    tagline: "Smooth lid, modern definition",
    characteristics:
      "Your smooth upper lid creates a sleek, modern canvas with minimal crease — perfect for clean, graduated lash definition.",
    lashRecommendation:
      "Choose lightweight, wispy styles that build length gradually without weighing the lid down.",
    explanation:
      "Monolid eyes have a smooth upper lid with little visible crease. Graduated lash lengths build dimension without weighing the lid down, creating depth that looks effortless and chic.",
    lashStyles: [
      { name: "Soft Flutter", detail: "Light, wispy lengths for everyday definition." },
      { name: "Graduated Open", detail: "Subtle increase from inner to outer corner." },
      { name: "Natural Wispy", detail: "Fine texture adds depth without bulk." },
    ],
    mapLabel: "Monolid dimension map",
  },
  upturned: {
    tagline: "Lifted, feline elegance",
    characteristics:
      "Your outer corners lift naturally upward, giving you a feline, lifted look that photographs beautifully.",
    lashRecommendation:
      "Choose fox-eye or cat-eye styles that follow your natural upward sweep for maximum impact.",
    explanation:
      "Upturned eyes lift at the outer corners, giving a naturally fox-eye effect. Lash maps that follow this upward sweep enhance your shape with a refined, lifted finish.",
    lashStyles: [
      { name: "Fox Eye", detail: "Outer flare mirrors your natural lift." },
      { name: "Dramatic Cat", detail: "Bold tail for evening and editorial looks." },
      { name: "Lifted Outer Fan", detail: "Fan placement at the outer third adds drama." },
    ],
    mapLabel: "Upturned lift map",
  },
  downturned: {
    tagline: "Gentle slope, lifted styling",
    characteristics:
      "Your outer corners slope gently downward, creating a soft, romantic eye shape with a naturally downturned gaze.",
    lashRecommendation:
      "Choose styles with lifted outer corners to open the eye and brighten your overall look.",
    explanation:
      "Downturned eyes slope slightly downward at the outer corners. Lash styles that emphasize lift at the outer edge brighten the gaze and create a more open, lifted appearance.",
    lashStyles: [
      { name: "Lifted Cat", detail: "Outer length counterbalances the natural slope." },
      { name: "Open Eye", detail: "Center and outer focus create upward visual pull." },
      { name: "Doll Outer Emphasis", detail: "Soft center with a lifted outer corner." },
    ],
    mapLabel: "Downturned lift map",
  },
};

export const RESULTS_COPY = {
  eyebrow: "Your lash profile",
  detected: "Detected eye shape",
  confidence: "Match confidence",
  scanQuality: "Scan quality",
  aboutShape: "About your shape",
  bestLashStyles: "Best lash styles for you",
  lashMap: "Recommended lash map",
  mapPlaceholder: "Illustration preview",
  retryScan: "Retry scan",
  alsoPossible: "Also possible",
} as const;

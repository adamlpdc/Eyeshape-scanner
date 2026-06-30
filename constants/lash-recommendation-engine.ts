/**
 * =============================================================================
 * LASH RECOMMENDATION ENGINE — beauty team config
 * =============================================================================
 *
 * Eye-shape copy and lash map labels live here.
 * Product cards are chosen at runtime from `constants/boots-product-catalog.ts`
 * (Boots eye shape scanner upload.xlsx): 2 shape-matched SKUs + 1 “All” SKU last.
 *
 * “About your shape” copy is sourced from the beauty team doc: Eye shape copy.docx
 * =============================================================================
 */

import type { EyeShape } from "@/types/classification";

/** UI labels used on the results screen (safe to edit). */
export const RECOMMENDATION_COPY = {
  yourEyeShape: "Your eye shape",
  scanPreviewAlt: "Photo from your scan",
  aboutShape: "Characteristics",
  lashRecommendation: "Lash recommendation",
  recommendedProducts: "Recommended for you",
  productPlaceholder: "Image coming soon",
  virtualTryOn: "Virtual try-on",
  buyAtBoots: "Buy at Boots",
  lashMap: "Recommended lash map",
  /** Shown when a scan cannot determine eye shape (from Eye shape copy.docx). */
  unknownShape:
    "We couldn't quite determine your eye shape this time, but don't worry, it happens. Try again in a well-lit spot and make sure your face is clearly centred in the frame. The clearer the image, the more accurate your lash match will be.",
} as const;

export interface EyeShapeProfile {
  explanation: string;
  lashMapLabel: string;
}

export const LASH_SHAPE_PROFILES: Record<EyeShape, EyeShapeProfile> = {
  hooded: {
    explanation:
      "Your prominent brow bone and hidden crease give your eyes a mysterious, smouldering quality. Sometimes the eyelid can appear smaller, but lashes can open them right up.",
    lashMapLabel: "Hooded lift map",
  },

  almond: {
    explanation:
      "Evenly balanced with a gentle upsweep, almond eyes are often seen as the most versatile shape. Almost every lash style will suit you, from subtle and natural to bold and dramatic.",
    lashMapLabel: "Almond balance map",
  },

  round: {
    explanation:
      "Bright, open and full of character, round eyes naturally give you that wide-awake, doll-like look. The height and width are almost equal, which means you can easily play with different lash shapes.",
    lashMapLabel: "Round elongation map",
  },

  monolid: {
    explanation:
      "A smooth lid space with little to no visible crease makes your eyes sleek and unique. This shape is amazing for pulling off sleek, seamless lash styles.",
    lashMapLabel: "Monolid dimension map",
  },

  upturned: {
    explanation:
      "Your eyes naturally lift at the outer corners, giving you that effortless cat-eye vibe without even trying. This shape works with almost any lash, but especially styles that follow the same upward sweep.",
    lashMapLabel: "Upturned lift map",
  },

  downturned: {
    explanation:
      "With outer corners that slope gently downwards, your eyes have a naturally soft, sultry feel. Outer-corner length adds extra drama to this gorgeous shape.",
    lashMapLabel: "Downturned lift map",
  },
};

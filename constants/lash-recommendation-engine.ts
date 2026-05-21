/**
 * =============================================================================
 * LASH RECOMMENDATION ENGINE — beauty team config
 * =============================================================================
 *
 * This file maps each detected eye shape to:
 *   • A short results explanation (“About your shape”)
 *   • Exactly 3 product recommendations (placeholders until SKUs are live)
 *
 * HOW TO EDIT
 * -----------
 * 1. Find the eye shape block below (hooded, almond, round, monolid, upturned, downturned).
 * 2. Update copy in `explanation` and `products`.
 * 3. Keep `products` to exactly 3 items per shape (TypeScript will error if not).
 * 4. When ready, set `productUrl` and `imageUrl` on each product (e.g. imageUrl: "/products/730.png").
 *
 * Do not change shape keys unless engineering adds new eye shapes in code.
 *
 * “About your shape” copy is sourced from the beauty team doc: Eye shape copy.docx
 * =============================================================================
 */

import type { EyeShape } from "@/types/classification";
import type { EyeShapeRecommendationMap } from "@/types/lash-recommendations";

/** UI labels used on the results screen (safe to edit). */
export const RECOMMENDATION_COPY = {
  yourEyeShape: "Your eye shape",
  scanPreviewAlt: "Close-up of your eyes from the scan",
  aboutShape: "Characteristics",
  lashRecommendation: "Lash Recommendation",
  recommendedProducts: "Recommended for you",
  productPlaceholder: "Image coming soon",
  virtualTryOn: "Virtual try on",
  buyAtBoots: "Buy at Boots",
  lashMap: "Recommended lash map",
  /** Shown when a scan cannot determine eye shape (from Eye shape copy.docx). */
  unknownShape:
    "We couldn't quite determine your eye shape this time, but don't worry, it happens. Try again in a well-lit spot and make sure your face is clearly centred in the frame. The clearer the image, the more accurate your lash match will be.",
} as const;

export const LASH_RECOMMENDATION_ENGINE: EyeShapeRecommendationMap = {
  hooded: {
    explanation:
      "Your prominent brow bone and hidden crease give your eyes a mysterious, smouldering quality. Sometimes the eyelid can appear smaller, but lashes can open them right up.",
    lashMapLabel: "Hooded lift map",
    products: [
      {
        id: "hooded-730",
        name: "Naturel No.730",
        tagline: "Light, fluttery lift for everyday hooded eyes.",
        badge: "No.1 match",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "hooded-035",
        name: "Lengthening No.035",
        tagline: "Adds length at the centre to open the lid.",
        badge: "Everyday",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "hooded-volume",
        name: "3/4 Length Volume",
        tagline: "Soft volume with a lifted outer corner.",
        badge: "Evening",
        productUrl: "",
        imageUrl: "",
      },
    ],
  },

  almond: {
    explanation:
      "Evenly balanced with a gentle upsweep, almond eyes are often seen as the most versatile shape. Almost every lash style will suit you, from subtle and natural to bold and dramatic.",
    lashMapLabel: "Almond balance map",
    products: [
      {
        id: "almond-117",
        name: "Texture No.117",
        tagline: "Balanced texture for naturally tapered eyes.",
        badge: "No.1 match",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "almond-glam",
        name: "Glamour No.101",
        tagline: "Fuller definition without overpowering the shape.",
        badge: "Everyday",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "almond-wispy",
        name: "Wispy No.3/4",
        tagline: "Soft flare for a refined cat-eye finish.",
        badge: "Evening",
        productUrl: "",
        imageUrl: "",
      },
    ],
  },

  round: {
    explanation:
      "Bright, open and full of character, round eyes naturally give you that wide-awake, doll-like look. The height and width are almost equal, which means you can easily play with different lash shapes.",
    lashMapLabel: "Round elongation map",
    products: [
      {
        id: "round-126",
        name: "Lengthening No.126",
        tagline: "Elongates round eyes with a lifted outer sweep.",
        badge: "No.1 match",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "round-107",
        name: "Texture No.107",
        tagline: "Natural texture that balances vertical openness.",
        badge: "Everyday",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "round-cat",
        name: "Volume Cat Eye",
        tagline: "Defined outer corner for evening looks.",
        badge: "Evening",
        productUrl: "",
        imageUrl: "",
      },
    ],
  },

  monolid: {
    explanation:
      "A smooth lid space with little to no visible crease makes your eyes sleek and unique. This shape is amazing for pulling off sleek, seamless lash styles.",
    lashMapLabel: "Monolid dimension map",
    products: [
      {
        id: "monolid-118",
        name: "Naturel No.118",
        tagline: "Feather-light band ideal for smooth lids.",
        badge: "No.1 match",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "monolid-031",
        name: "Accent No.031",
        tagline: "Subtle graduated length for daily wear.",
        badge: "Everyday",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "monolid-petite",
        name: "Petite Wispy",
        tagline: "Short band length suited to monolid eyes.",
        badge: "Evening",
        productUrl: "",
        imageUrl: "",
      },
    ],
  },

  upturned: {
    explanation:
      "Your eyes naturally lift at the outer corners, giving you that effortless cat-eye vibe without even trying. This shape works with almost any lash, but especially styles that follow the same upward sweep.",
    lashMapLabel: "Upturned lift map",
    products: [
      {
        id: "upturned-126",
        name: "Lengthening No.126",
        tagline: "Accentuates your natural upward tilt.",
        badge: "No.1 match",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "upturned-glam",
        name: "Glamour No.101",
        tagline: "Fuller lashes that follow the fox-eye line.",
        badge: "Everyday",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "upturned-drama",
        name: "Dramatic Volume",
        tagline: "Bold outer fan for night-out looks.",
        badge: "Evening",
        productUrl: "",
        imageUrl: "",
      },
    ],
  },

  downturned: {
    explanation:
      "With outer corners that slope gently downwards, your eyes have a naturally soft, sultry feel. Outer-corner length adds extra drama to this gorgeous shape.",
    lashMapLabel: "Downturned lift map",
    products: [
      {
        id: "downturned-035",
        name: "Lengthening No.035",
        tagline: "Centre length helps lift downturned eyes.",
        badge: "No.1 match",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "downturned-117",
        name: "Texture No.117",
        tagline: "Soft, even texture for everyday brightness.",
        badge: "Everyday",
        productUrl: "",
        imageUrl: "",
      },
      {
        id: "downturned-open",
        name: "Open Eye Lift",
        tagline: "Outer-corner emphasis for an awake look.",
        badge: "Evening",
        productUrl: "",
        imageUrl: "",
      },
    ],
  },
};

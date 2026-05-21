import type { EyeShape } from "@/types/classification";

/**
 * Placeholder product card — replace name, URLs, and image when SKUs are final.
 * The beauty team should keep exactly three products per eye shape.
 */
export interface ProductRecommendation {
  /** Internal id for analytics or deep links, e.g. "hooded-730". */
  id: string;
  name: string;
  tagline: string;
  /** Shown on card, e.g. "No.1 match", "Everyday", "Evening". */
  badge?: string;
  /** Product detail page — leave empty for prototype. */
  productUrl?: string;
  /** Pack shot path under /public or full CDN URL. */
  imageUrl?: string;
}

/** Full recommendation bundle returned after a scan. */
export interface EyeShapeRecommendation {
  explanation: string;
  lashMapLabel: string;
  products: [
    ProductRecommendation,
    ProductRecommendation,
    ProductRecommendation,
  ];
}

export type EyeShapeRecommendationMap = Record<EyeShape, EyeShapeRecommendation>;

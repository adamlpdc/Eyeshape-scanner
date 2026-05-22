import type { EyeShape } from "@/types/classification";

/** Product card served on the results screen (SKU-led from Boots catalog). */
export interface ProductRecommendation {
  /** SKU code — primary identifier for analytics and deep links. */
  id: string;
  sku: string;
  name: string;
  tagline?: string;
  badge?: string;
  tryOnUrl?: string;
  /** Boots product page — shown as “Buy at Boots”. */
  productUrl?: string;
  /** Pack shot at `/public/products/{sku}.jpg`. */
  imageUrl?: string;
}

/** Full recommendation bundle returned after a scan. */
export interface EyeShapeRecommendation {
  explanation: string;
  lashMapLabel: string;
  /** Up to three products: shape-matched first, “All” catalog item last. */
  products: ProductRecommendation[];
}

export type EyeShapeRecommendationMap = Record<EyeShape, EyeShapeRecommendation>;

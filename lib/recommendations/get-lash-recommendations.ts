import { LASH_SHAPE_PROFILES } from "@/constants/lash-recommendation-engine";
import type { EyeShape } from "@/types/classification";
import type { EyeShapeRecommendation } from "@/types/lash-recommendations";
import { pickProductRecommendations } from "@/lib/recommendations/pick-product-recommendations";

/**
 * Returns lash style copy and up to three Boots product recommendations for a scan.
 */
export function getLashRecommendations(
  eyeShape: EyeShape,
): EyeShapeRecommendation {
  const profile = LASH_SHAPE_PROFILES[eyeShape];
  const products = pickProductRecommendations(eyeShape);

  return {
    explanation: profile.explanation,
    lashMapLabel: profile.lashMapLabel,
    products,
  };
}

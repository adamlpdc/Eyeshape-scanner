import { LASH_RECOMMENDATION_ENGINE } from "@/constants/lash-recommendation-engine";
import type { EyeShape } from "@/types/classification";
import type { EyeShapeRecommendation } from "@/types/lash-recommendations";

/**
 * Returns lash style and product recommendations for a classified eye shape.
 * All logic is config-driven — edit `constants/lash-recommendation-engine.ts`.
 */
export function getLashRecommendations(
  eyeShape: EyeShape,
): EyeShapeRecommendation {
  return LASH_RECOMMENDATION_ENGINE[eyeShape];
}

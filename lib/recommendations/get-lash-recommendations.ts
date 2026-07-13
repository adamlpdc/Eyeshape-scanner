import { LASH_SHAPE_PROFILES } from "@/constants/lash-recommendation-engine";
import type { EyeShape } from "@/types/classification";

/** Lash style copy for the results screen (product picks live in tabbed UI). */
export function getLashRecommendations(eyeShape: EyeShape) {
  const profile = LASH_SHAPE_PROFILES[eyeShape];

  return {
    explanation: profile.explanation,
    lashMapLabel: profile.lashMapLabel,
  };
}

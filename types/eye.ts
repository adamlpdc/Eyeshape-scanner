export type EyeSide = "left" | "right";

export interface EyeMeasurements {
  side: EyeSide;
  width: number;
  height: number;
  aspectRatio: number;
  outerCornerAngleDeg: number;
  /** Vertical opening relative to eye width (height / width). */
  upperEyelidOpenness: number;
  /** Brow-to-upper-lid distance relative to eye width. */
  browDistance: number;
  /** Iris diameter relative to eye width. */
  irisVisibility: number;
  /** Positive ≈ upturned outer corner; negative ≈ downturned. */
  canthalTilt: number;
  confidence: number;
}

export interface FaceEyeMeasurements {
  left: EyeMeasurements;
  right: EyeMeasurements;
}

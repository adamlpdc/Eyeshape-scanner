import { FaceLandmarker } from "@mediapipe/tasks-vision";

export type EyeSide = "left" | "right";

/** Subject's left/right eye — matches MediaPipe FaceLandmarker naming. */
export const EYE_LANDMARK_CONFIG = {
  left: {
    connections: FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
    /** EAR: outer, upper₁, upper₂, inner, lower₂, lower₁ */
    earIndices: [362, 385, 387, 263, 373, 380] as const,
    outerCorner: 362,
    innerCorner: 263,
    upperLid: 386,
    lowerLid: 374,
    browCenter: 282,
    irisIndices: [474, 475, 476, 477] as const,
  },
  right: {
    connections: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
    earIndices: [33, 160, 158, 133, 153, 144] as const,
    outerCorner: 33,
    innerCorner: 133,
    upperLid: 159,
    lowerLid: 145,
    browCenter: 52,
    irisIndices: [469, 470, 471, 472] as const,
  },
} as const;

export function getConnectionIndices(
  connections: { start: number; end: number }[],
): number[] {
  const indices = new Set<number>();
  for (const { start, end } of connections) {
    indices.add(start);
    indices.add(end);
  }
  return [...indices].sort((a, b) => a - b);
}

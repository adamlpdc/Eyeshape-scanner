import {
  FaceLandmarker,
  type DrawingUtils,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

/** Optional debug overlay — not used in the consumer scan UI. */
export function drawEyes(
  drawingUtils: DrawingUtils,
  landmarks: NormalizedLandmark[],
): void {
  drawingUtils.drawConnectors(
    landmarks,
    FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
    { color: "#38bdf8", lineWidth: 2 },
  );
  drawingUtils.drawConnectors(
    landmarks,
    FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
    { color: "#fbbf24", lineWidth: 2 },
  );
}

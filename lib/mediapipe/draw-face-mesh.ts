import {
  FaceLandmarker,
  type DrawingUtils,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { EYLURE_COLORS } from "@/constants/eylure-brand";

export function drawFaceMesh(
  drawingUtils: DrawingUtils,
  landmarks: NormalizedLandmark[],
): void {
  drawingUtils.drawConnectors(
    landmarks,
    FaceLandmarker.FACE_LANDMARKS_TESSELATION,
    { color: EYLURE_COLORS.meshGreen, lineWidth: 0.6 },
  );
  drawingUtils.drawLandmarks(landmarks, {
    color: EYLURE_COLORS.meshGreen,
    lineWidth: 0.5,
    radius: 1.2,
  });
}

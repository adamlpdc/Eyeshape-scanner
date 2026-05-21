import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface Point2D {
  x: number;
  y: number;
}

export function toPixel(
  landmark: NormalizedLandmark,
  frameWidth: number,
  frameHeight: number,
): Point2D {
  return {
    x: landmark.x * frameWidth,
    y: landmark.y * frameHeight,
  };
}

export function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

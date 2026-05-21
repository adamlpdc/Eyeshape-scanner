import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import {
  MEDIAPIPE_MODEL_PATH,
  MEDIAPIPE_WASM_CDN,
} from "@/constants/mediapipe";

let landmarkerInstance: FaceLandmarker | null = null;
let landmarkerPromise: Promise<FaceLandmarker> | null = null;

function getWasmBase(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/mediapipe/wasm`;
  }
  return MEDIAPIPE_WASM_CDN;
}

async function createLandmarker(
  vision: Awaited<
    ReturnType<
      typeof import("@mediapipe/tasks-vision").FilesetResolver.forVisionTasks
    >
  >,
  delegate: "CPU" | "GPU",
) {
  const { FaceLandmarker } = await import("@mediapipe/tasks-vision");

  return FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MEDIAPIPE_MODEL_PATH,
      delegate,
    },
    runningMode: "VIDEO",
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  });
}

export async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerInstance) {
    return landmarkerInstance;
  }

  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(getWasmBase());

      try {
        landmarkerInstance = await createLandmarker(vision, "GPU");
      } catch {
        landmarkerInstance = await createLandmarker(vision, "CPU");
      }

      return landmarkerInstance;
    })();
  }

  return landmarkerPromise;
}

export function releaseFaceLandmarker(): void {
  landmarkerInstance?.close();
  landmarkerInstance = null;
  landmarkerPromise = null;
}

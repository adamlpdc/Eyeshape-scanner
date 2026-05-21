import type { FaceLandmarker } from "@mediapipe/tasks-vision";

const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let landmarkerInstance: FaceLandmarker | null = null;
let landmarkerPromise: Promise<FaceLandmarker> | null = null;

function getWasmBase(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/mediapipe/wasm`;
  }
  return "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
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
      modelAssetPath: MODEL_PATH,
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

      // GPU is faster on desktop when WebGL is available; CPU is the reliable fallback.
      // The "XNNPACK delegate for CPU" console line is normal INFO when using CPU.
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

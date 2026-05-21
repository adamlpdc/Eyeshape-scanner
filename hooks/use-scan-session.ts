"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { SCAN_DURATION_MS, SCAN_ERRORS, PROGRESS_UPDATE_MS } from "@/constants/scan";
import { SCAN_QUALITY_CONFIG } from "@/constants/scan-quality";
import { CameraAccessError } from "@/lib/camera/camera-errors";
import { getCameraStream } from "@/lib/camera/get-camera-stream";
import { classifyEyeShape } from "@/lib/classification/classify-eye-shape";
import { averageFaceEyeMeasurements } from "@/lib/measurements/average-measurements";
import { measureBothEyes } from "@/lib/measurements/measure-eye";
import { drawFaceMesh } from "@/lib/mediapipe/draw-face-mesh";
import { captureVideoPreview } from "@/lib/scan/capture-preview";
import {
  getFaceLandmarker,
  releaseFaceLandmarker,
} from "@/lib/mediapipe/face-landmarker";
import { observeVideoCanvasSync } from "@/lib/mediapipe/observe-video-canvas-sync";
import { syncCanvasToVideo } from "@/lib/mediapipe/sync-canvas-to-video";
import {
  assessScanReadiness,
  resetReadinessTracking,
} from "@/lib/scan/assess-readiness";
import { createScanError } from "@/lib/scan/scan-error";
import type { EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import type { ScanReadiness } from "@/types/scan-quality";
import type { ScanError, ScanPhase } from "@/types/scan";

const INITIAL_READINESS: ScanReadiness = {
  faceDetected: false,
  alignment: 0,
  distance: 0,
  lighting: 0,
  stillness: 0,
  overall: 0,
  primaryIssue: "no_face",
  suggestions: [],
  canStartCapture: false,
};

function clearCaptureRefs(
  samplesRef: RefObject<FaceEyeMeasurements[]>,
  captureStartRef: RefObject<number | null>,
  isModelReadyRef: RefObject<boolean>,
  readinessScoresRef: RefObject<number[]>,
) {
  samplesRef.current = [];
  captureStartRef.current = null;
  isModelReadyRef.current = false;
  readinessScoresRef.current = [];
}

export function useScanSession() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const samplesRef = useRef<FaceEyeMeasurements[]>([]);
  const captureStartRef = useRef<number | null>(null);
  const isModelReadyRef = useRef(false);
  const stableReadyFramesRef = useRef(0);
  const unstableFramesRef = useRef(0);
  const readinessScoresRef = useRef<number[]>([]);
  const lastReadinessRef = useRef<ScanReadiness>(INITIAL_READINESS);

  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [isModelReady, setIsModelReady] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [readiness, setReadiness] = useState<ScanReadiness>(INITIAL_READINESS);
  const [scanSessionConfidence, setScanSessionConfidence] = useState(0);
  const [averagedResults, setAveragedResults] =
    useState<FaceEyeMeasurements | null>(null);
  const [classification, setClassification] =
    useState<EyeShapeClassification | null>(null);
  const [capturedFrameCount, setCapturedFrameCount] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<ScanError | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const goToIdle = useCallback(
    (nextError: ScanError | null = null) => {
      stopCamera();
      releaseFaceLandmarker();
      resetReadinessTracking();
      clearCaptureRefs(
        samplesRef,
        captureStartRef,
        isModelReadyRef,
        readinessScoresRef,
      );
      stableReadyFramesRef.current = 0;
      unstableFramesRef.current = 0;
      setPhase("idle");
      setIsModelReady(false);
      setCaptureProgress(0);
      setReadiness(INITIAL_READINESS);
      setScanSessionConfidence(0);
      setAveragedResults(null);
      setClassification(null);
      setCapturedFrameCount(0);
      setPreviewImage(null);
      setProcessingProgress(0);
      setError(nextError);
    },
    [stopCamera],
  );

  const unlockResults = useCallback(() => {
    setPhase("results");
  }, []);

  const resetScan = useCallback(() => {
    goToIdle(null);
  }, [goToIdle]);

  const returnToAligning = useCallback(() => {
    captureStartRef.current = null;
    samplesRef.current = [];
    readinessScoresRef.current = [];
    stableReadyFramesRef.current = 0;
    unstableFramesRef.current = 0;
    setCaptureProgress(0);
    setScanSessionConfidence(0);
    setPhase("aligning");
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (phase !== "processing") {
      return;
    }

    setProcessingProgress(0);
    const started = performance.now();
    const durationMs = 2800;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(
        100,
        ((now - started) / durationMs) * 100,
      );
      setProcessingProgress(progress);

      if (progress < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setPhase("unlock");
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "aligning" && phase !== "capturing") {
      releaseFaceLandmarker();
      setIsModelReady(false);
      setCaptureProgress(0);
      setReadiness(INITIAL_READINESS);
      setScanSessionConfidence(0);
      clearCaptureRefs(
        samplesRef,
        captureStartRef,
        isModelReadyRef,
        readinessScoresRef,
      );
      stableReadyFramesRef.current = 0;
      unstableFramesRef.current = 0;
    }
  }, [phase]);

  const isCameraActive = phase === "aligning" || phase === "capturing";
  const phaseRef = useRef<ScanPhase>(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!isCameraActive) {
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let lastVideoTime = -1;
    let lastUiUpdate = 0;
    let stopSync: (() => void) | undefined;
    let detectTimestamp = 0;

    const finishCapture = () => {
      if (cancelled) {
        return;
      }

      cancelled = true;
      cancelAnimationFrame(animationId);
      stopSync?.();

      const video = videoRef.current;
      const snapshot = video ? captureVideoPreview(video) : null;

      stopCamera();

      const samples = samplesRef.current;
      const scores = readinessScoresRef.current;

      if (samples.length === 0) {
        goToIdle(createScanError("no_face"));
        return;
      }

      const sessionConfidence =
        scores.length > 0
          ? scores.reduce((sum, value) => sum + value, 0) / scores.length
          : 0;

      if (sessionConfidence < SCAN_QUALITY_CONFIG.minScanSessionConfidence) {
        goToIdle(
          createScanError(
            "low_quality",
            undefined,
            lastReadinessRef.current.suggestions,
          ),
        );
        return;
      }

      const averaged = averageFaceEyeMeasurements(samples);
      setAveragedResults(averaged);
      setClassification(classifyEyeShape(averaged));
      setCapturedFrameCount(samples.length);
      setScanSessionConfidence(sessionConfidence);
      setPreviewImage(snapshot);
      setError(null);
      setPhase("processing");
    };

    async function runLandmarker() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        return;
      }

      await new Promise<void>((resolve) => {
        if (video.videoWidth > 0) {
          resolve();
          return;
        }
        video.addEventListener("loadeddata", () => resolve(), { once: true });
      });

      if (cancelled) {
        return;
      }

      stopSync = observeVideoCanvasSync(video, canvas);

      const [{ DrawingUtils }, landmarker] = await Promise.all([
        import("@mediapipe/tasks-vision"),
        getFaceLandmarker(),
      ]);

      if (cancelled) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context.");
      }

      const drawingUtils = new DrawingUtils(ctx);

      const render = () => {
        if (cancelled) {
          return;
        }

        animationId = requestAnimationFrame(render);

        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          return;
        }

        if (!syncCanvasToVideo(video, canvas)) {
          return;
        }

        if (video.currentTime === lastVideoTime) {
          return;
        }
        lastVideoTime = video.currentTime;

        detectTimestamp = Math.max(detectTimestamp + 1, video.currentTime * 1000);

        const results = landmarker.detectForVideo(video, detectTimestamp);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const landmarks = results.faceLandmarks[0];
        const now = performance.now();
        const currentReadiness = assessScanReadiness(landmarks, video);

        lastReadinessRef.current = currentReadiness;

        if (landmarks && !isModelReadyRef.current) {
          isModelReadyRef.current = true;
        }

        if (landmarks) {
          drawFaceMesh(drawingUtils, landmarks);
        }

        if (phaseRef.current === "aligning") {
          if (currentReadiness.canStartCapture) {
            stableReadyFramesRef.current += 1;
          } else {
            stableReadyFramesRef.current = 0;
          }

          if (
            stableReadyFramesRef.current >=
            SCAN_QUALITY_CONFIG.stableFramesRequired
          ) {
            phaseRef.current = "capturing";
            captureStartRef.current = now;
            stableReadyFramesRef.current = 0;
            unstableFramesRef.current = 0;
            setPhase("capturing");
          }
        }

        if (phaseRef.current === "capturing") {
          if (!currentReadiness.canStartCapture) {
            unstableFramesRef.current += 1;
          } else {
            unstableFramesRef.current = 0;
          }

          if (
            unstableFramesRef.current >=
            SCAN_QUALITY_CONFIG.unstableFramesToAbort
          ) {
            phaseRef.current = "aligning";
            returnToAligning();
            return;
          }

          if (captureStartRef.current !== null && landmarks) {
            samplesRef.current.push(
              measureBothEyes(landmarks, video.videoWidth, video.videoHeight),
            );
            readinessScoresRef.current.push(currentReadiness.overall);
          }

          if (captureStartRef.current !== null) {
            const elapsed = now - captureStartRef.current;
            const progress = Math.min(100, (elapsed / SCAN_DURATION_MS) * 100);

            if (now - lastUiUpdate >= PROGRESS_UPDATE_MS) {
              lastUiUpdate = now;
              setCaptureProgress(progress);
              setScanSessionConfidence(
                readinessScoresRef.current.length > 0
                  ? readinessScoresRef.current.reduce(
                      (sum, value) => sum + value,
                      0,
                    ) / readinessScoresRef.current.length
                  : 0,
              );
            }

            if (elapsed >= SCAN_DURATION_MS) {
              finishCapture();
            }
          }
        }

        if (now - lastUiUpdate >= PROGRESS_UPDATE_MS) {
          lastUiUpdate = now;
          setReadiness(currentReadiness);
          if (isModelReadyRef.current) {
            setIsModelReady(true);
          }
        }
      };

      render();
    }

    runLandmarker().catch(() => {
      if (!cancelled) {
        goToIdle(createScanError("landmarker_failed"));
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
      stopSync?.();
    };
  }, [isCameraActive, goToIdle, stopCamera, returnToAligning]);

  const startScan = useCallback(async () => {
    setError(null);
    setIsModelReady(false);
    setCaptureProgress(0);
    setReadiness(INITIAL_READINESS);
    setScanSessionConfidence(0);
    setAveragedResults(null);
    setClassification(null);
    setCapturedFrameCount(0);
    setPreviewImage(null);
    setProcessingProgress(0);
    resetReadinessTracking();
    clearCaptureRefs(
      samplesRef,
      captureStartRef,
      isModelReadyRef,
      readinessScoresRef,
    );
    stableReadyFramesRef.current = 0;
    unstableFramesRef.current = 0;

    try {
      const stream = await getCameraStream();

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setPhase("aligning");
    } catch (err) {
      if (err instanceof CameraAccessError) {
        goToIdle(createScanError(err.code));
        return;
      }

      goToIdle(
        createScanError(
          "unknown",
          err instanceof Error ? err.message : SCAN_ERRORS.cameraFailed,
        ),
      );
    }
  }, [goToIdle]);

  const retry = useCallback(() => {
    void startScan();
  }, [startScan]);

  return {
    videoRef,
    canvasRef,
    phase,
    isModelReady,
    readiness,
    captureProgress,
    scanSessionConfidence,
    averagedResults,
    classification,
    capturedFrameCount,
    previewImage,
    processingProgress,
    error,
    showCamera: phase === "aligning" || phase === "capturing",
    startScan,
    resetScan,
    retry,
    unlockResults,
  };
}

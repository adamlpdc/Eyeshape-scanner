"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SCAN_DURATION_MS, SCAN_ERRORS, PROGRESS_UPDATE_MS } from "@/constants/scan";
import { getCameraStream } from "@/lib/camera/get-camera-stream";
import { classifyEyeShape } from "@/lib/classification/classify-eye-shape";
import { averageFaceEyeMeasurements } from "@/lib/measurements/average-measurements";
import { measureBothEyes } from "@/lib/measurements/measure-eye";
import { drawEyes } from "@/lib/mediapipe/draw-eyes";
import {
  getFaceLandmarker,
  releaseFaceLandmarker,
} from "@/lib/mediapipe/face-landmarker";
import { observeVideoCanvasSync } from "@/lib/mediapipe/observe-video-canvas-sync";
import { syncCanvasToVideo } from "@/lib/mediapipe/sync-canvas-to-video";
import type { EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import type { ScanPhase } from "@/types/scan";

export function useScanSession() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const samplesRef = useRef<FaceEyeMeasurements[]>([]);
  const captureStartRef = useRef<number | null>(null);
  const isModelReadyRef = useRef(false);

  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [isModelReady, setIsModelReady] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [averagedResults, setAveragedResults] =
    useState<FaceEyeMeasurements | null>(null);
  const [classification, setClassification] =
    useState<EyeShapeClassification | null>(null);
  const [capturedFrameCount, setCapturedFrameCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const resetScan = useCallback(() => {
    stopCamera();
    releaseFaceLandmarker();
    samplesRef.current = [];
    captureStartRef.current = null;
    isModelReadyRef.current = false;
    setPhase("idle");
    setIsModelReady(false);
    setCaptureProgress(0);
    setAveragedResults(null);
    setClassification(null);
    setCapturedFrameCount(0);
    setError(null);
  }, [stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (phase !== "capturing") {
      releaseFaceLandmarker();
      setIsModelReady(false);
      setCaptureProgress(0);
      samplesRef.current = [];
      captureStartRef.current = null;
      isModelReadyRef.current = false;
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "capturing") {
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let lastVideoTime = -1;
    let lastProgressUpdate = 0;
    let stopSync: (() => void) | undefined;
    let detectTimestamp = 0;

    const finishCapture = () => {
      if (cancelled) {
        return;
      }

      cancelled = true;
      cancelAnimationFrame(animationId);
      stopSync?.();
      stopCamera();

      const samples = samplesRef.current;
      if (samples.length === 0) {
        setError(SCAN_ERRORS.noFace);
        setPhase("idle");
        return;
      }

      const averaged = averageFaceEyeMeasurements(samples);
      setAveragedResults(averaged);
      setClassification(classifyEyeShape(averaged));
      setCapturedFrameCount(samples.length);
      setPhase("results");
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

        if (landmarks && !isModelReadyRef.current) {
          isModelReadyRef.current = true;
          setIsModelReady(true);
        }

        if (landmarks) {
          drawEyes(drawingUtils, landmarks);

          if (captureStartRef.current !== null) {
            samplesRef.current.push(
              measureBothEyes(landmarks, video.videoWidth, video.videoHeight),
            );
          }
        }

        if (captureStartRef.current === null && landmarks) {
          captureStartRef.current = now;
        }

        if (captureStartRef.current !== null) {
          const elapsed = now - captureStartRef.current;
          const progress = Math.min(100, (elapsed / SCAN_DURATION_MS) * 100);

          if (now - lastProgressUpdate >= PROGRESS_UPDATE_MS) {
            lastProgressUpdate = now;
            setCaptureProgress(progress);
          }

          if (elapsed >= SCAN_DURATION_MS) {
            finishCapture();
          }
        }
      };

      render();
    }

    runLandmarker().catch((err) => {
      if (!cancelled) {
        const message =
          err instanceof Error ? err.message : SCAN_ERRORS.landmarkerFailed;
        setError(message);
        resetScan();
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
      stopSync?.();
    };
  }, [phase, resetScan, stopCamera]);

  const startScan = useCallback(async () => {
    setError(null);
    setIsModelReady(false);
    setCaptureProgress(0);
    setAveragedResults(null);
    setClassification(null);
    setCapturedFrameCount(0);
    samplesRef.current = [];
    captureStartRef.current = null;
    isModelReadyRef.current = false;

    try {
      const stream = await getCameraStream();

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setPhase("capturing");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : SCAN_ERRORS.cameraFailed;
      setError(message);
      setPhase("idle");
    }
  }, []);

  return {
    videoRef,
    canvasRef,
    phase,
    isModelReady,
    captureProgress,
    averagedResults,
    classification,
    capturedFrameCount,
    error,
    showCamera: phase === "capturing",
    startScan,
    resetScan,
  };
}
